import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RequestBody {
  type: "summary" | "experience" | "skills" | "match" | "parse" | "cover-letter" | "review" | "strategy" | "improve_content";
  context: {
    jobTitle?: string;
    company?: string;
    currentText?: string;
    skills?: string[];
    yearsExperience?: number;
    jobDescription?: string;
    resumeData?: any;
    rawText?: string;
    sectionType?: string;
  };
}

serve(async (req) => {
  // --- CORS ---
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // --- ENV ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // --- SAFE BODY PARSING ---
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { type, context } = body ?? {};
    if (!type || !context) {
      return new Response(
        JSON.stringify({ error: "Missing type or context" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`AI suggestion request - type=${type}`);

    const PROMPTS: Record<string, { system: string; user: string }> = {
      summary: {
        system: `You are an expert resume writer. 
        Write a single, concise, impactful professional summary.
        STRICT RULES:
        - Use Markdown for emphasis (e.g. **keywords**) where appropriate.
        - Output exactly ONE version. No options, no lists.
        - Max 2-3 sentences.
        - Focus on unique value and ATS-friendly keywords.`,
        user: context.currentText?.trim()
          ? `Improve this summary: "${context.currentText}"`
          : `Write a summary for a ${context.jobTitle || 'professional'} with ${context.yearsExperience || 'several'} years exp. Skills: ${context.skills?.join(', ') || 'N/A'}.`
      },
      experience: {
        system: `You are an expert resume writer. 
        Write 3-4 impactful bullet points.
        STRICT RULES:
        - Use Markdown bullet points ('-') and emphasis (**bold**) for key achievements.
        - Provide exactly ONE set of bullets.
        - Use strong action verbs and quantifiable achievements.`,
        user: context.currentText?.trim()
          ? `Improve this job description: "${context.currentText}"`
          : `Write 3-4 bullet points for a ${context.jobTitle || 'professional'} role at ${context.company || 'a company'}.`
      },
      skills: {
        system: `You are an expert career advisor. Suggest 8-10 relevant industry-standard skills (mix of technical and soft).`,
        user: `Suggest skills for a ${context.jobTitle || 'professional'} role. ${context.skills?.length ? `Already have: ${context.skills.join(', ')}.` : ''} Return only names, one per line.`
      },
      match: {
        system: `You are an expert ATS analyst. Analyze the match between the resume and JD. Return strictly valid JSON with matchScore, matchingKeywords, missingKeywords, and suggestions.`,
        user: `JD: ${context.jobDescription || "No job description provided"}\nRESUME: ${JSON.stringify(context.resumeData || {})}`
      },
      parse: {
        system: `You are an expert resume parsing engine. Extract structured data into JSON matching the required schema. Be thorough.`,
        user: `RAW TEXT: ${context.rawText || "No text provided"}\nReturn ONLY valid JSON.`
      },
      "cover-letter": {
        system: `You are an expert professional writer. Write a tailored, concise (3-4 paras) cover letter based on resume and JD. Formal but enthusiastic.`,
        user: `JD: ${context.jobDescription || "No job description provided"}\nRESUME: ${JSON.stringify(context.resumeData || {})}`
      },
      review: {
        system: `You are an experienced recruiter and hiring manager. Review the resume for a real role.
      Output strictly valid JSON.
      Review Logic:
      1. Scan for 6 seconds.
      2. Decide: Strong Yes, Maybe, or No.
      3. Identify heatmap (high/medium/ignored sections).
      4. List red flags.
      5. Check ATS compatibility.
      6. List top 5 actionable fixes.
      7. Give confidence score (0-100).

      JSON Structure:
      {
        "impression": "string",
        "decision": "Strong Yes" | "Maybe" | "No",
        "decisionReason": "string",
        "heatmap": {
          "high": ["string"],
          "medium": ["string"],
          "ignored": ["string"]
        },
        "redFlags": ["string"],
        "atsCheck": {
          "passed": boolean,
          "issues": ["string"]
        },
        "fixes": ["string"],
        "score": number,
        "scoreReason": "string"
      }`,
        user: `RESUME: ${JSON.stringify(context.resumeData || {})}\nJOB DESCRIPTION: ${context.jobDescription || 'General Professional Role'}`
      },
      strategy: {
        system: `You are an experienced recruiter and resume strategist who has reviewed thousands of resumes.
        Your task is to determine the most effective resume template strategy for the candidate based on how recruiters actually scan resumes.
        Optimize for: Speed of scanning (6–10 seconds), ATS compatibility, Signal-to-noise ratio, Role relevance.

        Output strictly valid JSON.

        JSON Structure:
        {
          "template": "Technical" | "Business" | "Executive" | "Academic" | "Creative" | "Fresh Graduate",
          "explanation": "Why this template is the best recruiter-facing strategy.",
          "scanningLogic": {
             "first": "First section they look at",
             "second": "Second section",
             "confirm": "What they expect to confirm quickly",
             "stop": "What would cause them to stop reading"
          },
          "sectionOrder": ["string (e.g. Summary, Skills, Experience...)"],
          "sectionVisibility": {
             "prominent": ["string"],
             "deemphasized": ["string"],
             "hidden": ["string"],
             "reasoning": "Reasoning for visibility rules"
          },
          "bulletRules": {
             "count": "Max bullets per role (e.g. '3-5')",
             "length": "Ideal bullet length",
             "metrics": "Required | Optional"
          },
          "atsSafe": boolean,
          "score": number,
          "scoreReason": "Confidence score reason"
        }`,
        user: `RESUME: ${JSON.stringify(context.resumeData || {})}\nJOB DESCRIPTION: ${context.jobDescription || 'General Professional Role'}`
      },
      improve_content: {
        system: `You are a professional resume writer. Rewrite the provided text to be more professional, action-oriented, and impactful. 
        Use strong action verbs. Quantify achievements where possible (add placeholders like [X] if needed but prefer polishing existing numbers).
        Keep it concise and suited for a resume. Return ONLY the rewritten text, no other commentary.`,
        user: `Original Text: "${context.currentText || "No text provided"}"\nSection Type: ${context.sectionType || "General"}`
      }
    };

    const prompt = PROMPTS[type];
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: `Unknown suggestion type: ${type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- TIMEOUT PROTECTION ---
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000); // 30s

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: prompt.system },
            { role: "user", content: prompt.user },
          ],
          max_tokens: 2000,
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const status = response.status;
      const errorMap: Record<number, string> = {
        429: "Rate limit exceeded. Please try again in a moment.",
        402: "AI usage limit reached. Please add credits to continue.",
      };

      return new Response(
        JSON.stringify({ error: errorMap[status] || `AI gateway error: ${status}` }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const suggestion = data?.choices?.[0]?.message?.content ?? "";

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI suggestion error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

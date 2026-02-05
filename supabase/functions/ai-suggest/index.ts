import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RequestBody {
  type: "summary" | "experience" | "skills" | "match" | "parse" | "cover-letter";
  context: {
    jobTitle?: string;
    company?: string;
    currentText?: string;
    skills?: string[];
    yearsExperience?: number;
    jobDescription?: string;
    resumeData?: any;
    rawText?: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { type, context }: RequestBody = await req.json();
    console.log(`AI suggestion request - type: ${type}`, context);

    const PROMPTS: Record<string, { system: string; user: string }> = {
      summary: {
        system: `You are an expert resume writer. 
        Write a single, concise, impactful professional summary.
        STRICT RULES:
        - Use Markdown for emphasis (e.g. **keywords**) where appropriate.
        - Provide exactly ONE version. No options, no lists.
        - Max 2-3 sentences.
        - Focus on unique value and ATS-friendly keywords.
        - Output will be professionally rendered in a resume template.`,
        user: context.currentText
          ? `Improve this summary: "${context.currentText}"`
          : `Write a summary for a ${context.jobTitle || 'professional'} with ${context.yearsExperience || 'several'} years exp. Skills: ${context.skills?.join(', ') || 'N/A'}.`
      },
      experience: {
        system: `You are an expert resume writer. 
        Write 3-4 impactful bullet points.
        STRICT RULES:
        - Use Markdown bullet points ('-') and emphasis (**bold**) for key achievements.
        - Provide exactly ONE set of bullets.
        - Use strong action verbs and quantifiable achievements.
        - Output will be professionally rendered in a resume template.`,
        user: context.currentText
          ? `Improve this job description: "${context.currentText}"`
          : `Write 3-4 bullet points for a ${context.jobTitle || 'professional'} role at ${context.company || 'a company'}.`
      },
      skills: {
        system: `You are an expert career advisor. Suggest 8-10 relevant industry-standard skills (mix of technical and soft).`,
        user: `Suggest skills for a ${context.jobTitle || 'professional'} role. ${context.skills?.length ? `Already have: ${context.skills.join(', ')}.` : ''} Return only names, one per line.`
      },
      match: {
        system: `You are an expert ATS analyst. Analyze the match between the resume and JD. Return strictly valid JSON with matchScore, matchingKeywords, missingKeywords, and suggestions.`,
        user: `JD: ${context.jobDescription}\nRESUME: ${JSON.stringify(context.resumeData)}`
      },
      parse: {
        system: `You are an expert resume parsing engine. Extract structured data into JSON matching the required schema. Be thorough.`,
        user: `RAW TEXT: ${context.rawText}\nReturn ONLY valid JSON.`
      },
      "cover-letter": {
        system: `You are an expert professional writer. Write a tailored, concise (3-4 paras) cover letter based on resume and JD. Formal but enthusiastic.`,
        user: `JD: ${context.jobDescription}\nRESUME: ${JSON.stringify(context.resumeData)}`
      }
    };

    const prompt = PROMPTS[type];
    if (!prompt) {
      throw new Error(`Unknown suggestion type: ${type}`);
    }

    console.log("Sending request to AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
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
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const status = response.status;
      const errorMap: Record<number, string> = {
        429: "Rate limit exceeded. Please try again in a moment.",
        402: "AI usage limit reached. Please add credits to continue."
      };

      return new Response(
        JSON.stringify({ error: errorMap[status] || `AI gateway error: ${status}` }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI suggestion error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

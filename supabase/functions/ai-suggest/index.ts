import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RequestBody {
  type: "summary" | "experience" | "skills";
  context: {
    jobTitle?: string;
    company?: string;
    currentText?: string;
    skills?: string[];
    yearsExperience?: number;
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

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "summary":
        systemPrompt = `You are an expert resume writer specializing in creating compelling professional summaries. 
Write concise, impactful summaries that:
- Are 2-3 sentences maximum
- Highlight key strengths and unique value
- Are ATS-friendly (avoid graphics, tables, or unusual formatting)
- Use action-oriented language
- Are tailored for the target role if provided`;

        userPrompt = context.currentText
          ? `Improve this professional summary to be more impactful and ATS-friendly:\n\n"${context.currentText}"\n\nMake it more compelling while keeping the core message.`
          : `Write a professional summary for someone with ${context.yearsExperience || 'several'} years of experience${context.jobTitle ? ` as a ${context.jobTitle}` : ''}${context.skills?.length ? `. Key skills: ${context.skills.join(', ')}` : ''}.`;
        break;

      case "experience":
        systemPrompt = `You are an expert resume writer specializing in job descriptions.
Write impactful job descriptions that:
- Use strong action verbs (Led, Developed, Implemented, etc.)
- Include quantifiable achievements where possible
- Are concise and scannable
- Are ATS-friendly
- Follow bullet point format with • character`;

        userPrompt = context.currentText
          ? `Improve this job description to be more impactful with better action verbs and quantifiable achievements:\n\n"${context.currentText}"\n\nPosition: ${context.jobTitle || 'Not specified'}\nCompany: ${context.company || 'Not specified'}`
          : `Write 3-4 bullet points for a ${context.jobTitle || 'professional'} role at ${context.company || 'a company'}. Focus on typical achievements and responsibilities.`;
        break;

      case "skills":
        systemPrompt = `You are an expert career advisor who helps identify relevant skills for resumes.
Suggest skills that are:
- Relevant to the target role
- ATS-friendly (use common industry terminology)
- A mix of technical and soft skills
- Specific rather than generic`;

        userPrompt = `Suggest 8-10 relevant skills for a ${context.jobTitle || 'professional'} role. 
${context.skills?.length ? `Already listed skills: ${context.skills.join(', ')}. Suggest different ones.` : ''}
Return only the skill names, one per line, no numbering or bullets.`;
        break;

      default:
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI gateway error: ${response.status}`, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "";

    console.log("AI suggestion generated successfully");

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
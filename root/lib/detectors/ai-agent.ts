import OpenAI from "openai";

const groq = new OpenAI({
 apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function analyzeWithAI(emailContent: string, linkReports: any[]) {
  try {
    const response = await groq.chat.completions.create({
      // Llama 3.3 70B is incredibly smart and free on Groq
      model: "llama-3.3-70b-versatile", 
      messages: [
        {
          role: "system",
          content: `You are a Phishing Detection AI. 
          You MUST respond only with a valid JSON object. 
          Do not include any conversational text before or after the JSON.`
        },
        {
          role: "user",
          content: `Analyze this email and link data. 
          Return a JSON object exactly in this format:
          {
            "threatLevel": "low" | "medium" | "high" | "extreme",
            "summary": "string",
            "analysis": "string",
            "verdict": "string"
          }

          Email: "${emailContent}"
          Links: ${JSON.stringify(linkReports)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("OpenAI Error:", error);
    return {
      threatLevel: "medium",
      summary: "AI analysis unavailable",
      analysis: "Check the technical link data manually.",
      verdict: "Proceed with caution."
    };
  }
}
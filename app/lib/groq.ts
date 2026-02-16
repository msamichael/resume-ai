import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function callGroq(prompt: string, retryCount = 3): Promise<any> {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });
      const text = completion.choices[0]?.message?.content;
      if (!text) {
        throw new Error("No content in Groq response");
      }
      const response = JSON.parse(text);

      return response;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === retryCount) {
        throw new Error("All attempts to query Groq failed");
      }
      await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
    }
  }
}

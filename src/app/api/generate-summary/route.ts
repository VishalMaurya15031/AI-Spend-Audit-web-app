import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportData } = body;

    if (!process.env.OPENAI_API_KEY) {
      // Fallback for demonstration if no key is provided
      return NextResponse.json({ 
        summary: `Based on our analysis, your current stack costs $${reportData.currentSpend}/mo. By following our optimization recommendations, you can reduce redundancies and save $${reportData.monthlySavings}/mo without losing any capabilities.` 
      });
    }

    const prompt = `You are an AI Spend Auditor. A startup has provided their AI tech stack.
Current Spend: $${reportData.currentSpend}/mo
Potential Savings: $${reportData.monthlySavings}/mo
Recommendations: ${JSON.stringify(reportData.recommendations)}

Write a short, punchy, 2-sentence personalized summary advising them on their stack. Be encouraging but professional.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    return NextResponse.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Failed to generate AI summary" }, { status: 500 });
  }
}

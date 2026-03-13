import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { question, includeHausa } = await req.json();
        const supabase = await createClient();

        // 1. Check Auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Simple Tier Check (Mock logic - in production query profiles table)
        // const { data: profile } = await supabase.from('profiles').select('subscription_tier, tma_credits').single();

        if (!process.env.AI_API_KEY) {
            return NextResponse.json({ error: "AI API Key not configured" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an expert academic assistant for National Open University of Nigeria (NOUN) students.
      Analyze the following TMA question: "${question}"

      Return the response strictly in JSON format with the following keys:
      - breakdown: A clear explanation of what the question is asking.
      - structure: An array of strings representing the suggested points/headings for the answer.
      - concepts: An array of 3-5 key academic concepts or keywords relevant to the question.
      - references: A suggested course material reference in APA format.
      ${includeHausa ? "- hausa: A brief explanation of the question in Hausa language." : ""}

      Keep the tone encouraging and academic.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean up potential markdown code blocks from AI response
        const jsonString = text.replace(/```json|```/g, "").trim();
        const parsedData = JSON.parse(jsonString);

        return NextResponse.json(parsedData);
    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze question" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const pdf = require("pdf-parse");
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("PDF Buffer size:", buffer.length);
        
        let data;
        try {
            data = await pdf(buffer);
        } catch (pdfError: any) {
            console.error("PDF Parsing Error:", pdfError);
            return NextResponse.json({ error: "Failed to read PDF content. Is it password protected?" }, { status: 422 });
        }

        const text = data.text;
        console.log("Extracted text length:", text.length);

        if (text.trim().length === 0) {
            return NextResponse.json({ error: "The PDF appears to be empty or image-based (OCR required)." }, { status: 422 });
        }

        if (!process.env.AI_API_KEY) {
            return NextResponse.json({ error: "AI API Key not configured" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an academic summarizer for NOUN students. 
      The following is text extracted from a course material PDF.
      
      Text Extract: "${text.substring(0, 8000)}" 
      
      Please provide:
      1. A summary organized by chapters or main topics.
      2. 3-5 flashcard style Q&As for study.
      3. 2-3 possible exam questions based on this content.

      Return the response strictly in JSON format with these exact keys:
      - chapters: Array of objects { title, points: string[] }
      - flashcards: Array of objects { q, a }
      - mockQuestions: Array of strings
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json|```/g, "").trim();
        const parsedData = JSON.parse(jsonString);

        return NextResponse.json(parsedData);
    } catch (error: any) {
        console.error("Summarization Error:", error);
        return NextResponse.json({ error: "Failed to process PDF. Ensure it's a valid text-based PDF." }, { status: 500 });
    }
}

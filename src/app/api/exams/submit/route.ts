import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exam_id, answers } = await req.json(); // answers is { question_id: selected_index }

    // 1. Fetch correct answers from DB
    const { data: questions, error: qError } = await supabase
      .from("exam_questions")
      .select("id, correct_option_index, question_text")
      .eq("exam_id", exam_id);

    if (qError) throw qError;

    // 2. Calculate score
    let score = 0;
    const weakAreas: string[] = [];

    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option_index) {
        score++;
      } else {
        // Simple logic for weak areas: identify keywords in failed questions
        // In a real app, questions would have topic tags
        if (q.question_text.toLowerCase().includes("noun")) weakAreas.push("Nouns");
        if (q.question_text.toLowerCase().includes("pronoun")) weakAreas.push("Pronouns");
      }
    });

    // 3. Save result
    const { data: result, error: sError } = await supabase
      .from("exam_results")
      .insert([
        {
          user_id: user.id,
          exam_id,
          score,
          total_questions: questions.length,
          weak_areas: Array.from(new Set(weakAreas)),
        },
      ])
      .select()
      .single();

    if (sError) throw sError;

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Exam Submission Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

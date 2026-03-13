import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { course_code, title, duration_minutes, questions } = await req.json();

    // 1. Create Exam
    const { data: exam, error: eError } = await supabase
      .from("exams")
      .insert([{ course_code, title, duration_minutes }])
      .select()
      .single();

    if (eError) throw eError;

    // 2. Insert Questions
    const questionsWithExamId = questions.map((q: any) => ({
      ...q,
      exam_id: exam.id,
    }));

    const { error: qError } = await supabase
      .from("exam_questions")
      .insert(questionsWithExamId);

    if (qError) throw qError;

    return NextResponse.json(exam);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

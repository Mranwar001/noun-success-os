"use client";

import { useState, useEffect } from "react";
import { Timer, CheckCircle, ChevronRight, AlertCircle, Trophy, Loader2, BookOpen } from "lucide-react";


export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [examStarted, setExamStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await fetch("/api/exams");
        const data = await res.json();
        setExams(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExams();
  }, []);

  const startExam = async (exam: any) => {
    setLoading(true);
    setSelectedExam(exam);
    try {
      const res = await fetch(`/api/exams/${exam.id}/questions`);
      const data = await res.json();
      setQuestions(data);
      setTimeLeft(exam.duration_minutes * 60);
      setExamStarted(true);
    } catch (err) {
      alert("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (examStarted && !finished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && examStarted && !finished) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [examStarted, finished, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_id: selectedExam.id,
          answers,
        }),
      });
      const data = await res.json();
      setResult(data);
      setFinished(true);
    } catch (err) {
      alert("Failed to submit exam");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !examStarted) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-500">Accessing Exam Servers...</p>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-900">E-Exam Simulator</h2>
          <p className="text-gray-500">Practice with professional mock exams designed by NOUN experts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed text-center text-gray-400">
              No exams currently available for your courses.
            </div>
          )}
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6 hover:border-primary-300 transition-all group">
              <div className="space-y-1">
                <span className="bg-primary-50 text-primary-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">{exam.course_code}</span>
                <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Duration</p>
                  <p className="font-bold text-gray-700">{exam.duration_minutes}m</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Status</p>
                  <p className="font-bold text-green-600">Available</p>
                </div>
              </div>
              <button
                onClick={() => startExam(exam)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition shadow-lg group-hover:bg-primary-600 group-hover:shadow-primary-100"
              >
                Enter Examination Hall
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-12">
        <div className="bg-white p-12 rounded-2xl shadow-2xl border text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Trophy className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Examination Report</h2>
            <p className="text-gray-500">Your score has been recorded and analyzed.</p>
          </div>
          
          <div className="flex justify-center items-baseline space-x-2">
            <span className="text-7xl font-black text-primary-600">{result.score}</span>
            <span className="text-2xl font-bold text-gray-300">/ {result.total_questions}</span>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl space-y-6 text-left border">
            <h4 className="font-bold text-gray-900 flex items-center space-x-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
              <span>Intelligent Analytics</span>
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Weak Areas Detected</p>
                <div className="flex flex-wrap gap-2">
                  {result.weak_areas.length > 0 ? result.weak_areas.map((area: string) => (
                    <span key={area} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                      {area}
                    </span>
                  )) : (
                    <span className="text-sm text-green-600 font-bold italic">No major weak areas detected! Excellent work.</span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {result.score / result.total_questions > 0.7 
                  ? "Your performance indicates strong readiness. Focus on time management for the actual exam."
                  : "We recommend reviewing the specific topics highlighted above in your NOUN course materials."}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-100 transition"
          >
            Review Correct Answers & Finish
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md border sticky top-0 z-10 animate-in slide-in-from-top-4">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-600 text-white p-2 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-gray-400 uppercase">{selectedExam.course_code}</span>
            <span className="font-bold text-gray-900">{selectedExam.title}</span>
          </div>
        </div>
        <div className={`flex items-center space-x-3 px-6 py-2 rounded-xl border-2 font-mono font-black text-2xl transition-colors ${timeLeft < 300 ? 'border-red-500 text-red-600 animate-pulse' : 'border-gray-50 text-primary-600'}`}>
          <Timer className="w-6 h-6" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="bg-white p-12 rounded-3xl shadow-sm border space-y-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
             <span className="bg-gray-900 text-white text-xs font-black px-3 py-1 rounded-full">QUESTION {currentIdx + 1}</span>
             <div className="h-px flex-1 bg-gray-100"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 leading-snug">
            {currentQuestion.question_text}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => setAnswers({ ...answers, [currentQuestion.id]: i })}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                answers[currentQuestion.id] === i 
                  ? "border-primary-500 bg-primary-50 shadow-inner" 
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                  answers[currentQuestion.id] === i ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={`font-bold transition-colors ${
                  answers[currentQuestion.id] === i ? "text-primary-900" : "text-gray-600"
                }`}>{opt}</span>
              </div>
              {answers[currentQuestion.id] === i && <CheckCircle className="w-6 h-6 text-primary-500" />}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-12 border-t">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-900 disabled:opacity-20 transition-colors"
          >
            Previous Item
          </button>
          
          <div className="flex items-center space-x-2">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${
                i === currentIdx ? "w-8 bg-primary-500" : answers[questions[i].id] !== undefined ? "w-4 bg-green-200" : "w-1.5 bg-gray-100"
              }`}></div>
            ))}
          </div>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleFinish}
              disabled={submitting}
              className="bg-green-600 text-white px-12 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-100 transition disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Finish Examination"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="flex items-center space-x-3 bg-primary-600 text-white px-12 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-100 transition"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

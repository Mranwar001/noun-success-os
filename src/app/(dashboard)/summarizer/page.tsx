"use client";

import { useState } from "react";
import { Upload, FileText, ListChecks, HelpCircle, Loader2, AlertCircle } from "lucide-react";

export default function SummarizerClient() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [summary, setSummary] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are supported.");
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleGenerate = async () => {
        if (!file) return;
        setProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setSummary(data);
        } catch (err: any) {
            setError(err.message || "Failed to process PDF. Large files might exceed memory limits.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Summarizer</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Upload course materials to get AI-powered chapter summaries.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {!summary ? (
                <div className="bg-white dark:bg-gray-900 p-12 rounded-2xl shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Course Material</h2>
                        <p className="text-gray-500 dark:text-gray-400">Only PDF documents are supported.</p>
                    </div>
                    <label className="cursor-pointer bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-100">
                        <span>{file ? file.name : "Select PDF File"}</span>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} />
                    </label>
                    {file && (
                        <button
                            onClick={handleGenerate}
                            disabled={processing}
                            className="mt-4 flex items-center space-x-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-black transition disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <FileText className="w-5 h-5" />
                            )}
                            <span>{processing ? "Summarizing (this may take a minute)..." : "Start AI Summarization"}</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border dark:border-gray-800 space-y-6">
                            <div className="flex justify-between items-center border-b dark:border-gray-800 pb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Chapter Summaries</h3>
                                <button
                                    onClick={() => { setSummary(null); setFile(null); }}
                                    className="text-primary-600 dark:text-primary-400 text-sm font-bold hover:underline"
                                >
                                    Clear & Upload New
                                </button>
                            </div>
                            {summary.chapters?.map((chapter: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="font-bold text-primary-600 dark:text-primary-400 flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                                        <span>{chapter.title || `Section ${i + 1}`}</span>
                                    </h4>
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 pl-4">
                                        {chapter.points?.map((p: string, j: number) => <li key={j} className="leading-relaxed">{p}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl space-y-4">
                            <h3 className="text-lg font-bold flex items-center space-x-2">
                                <ListChecks className="w-5 h-5" />
                                <span>AI Study Cards</span>
                            </h3>
                            <div className="space-y-4">
                                {summary.flashcards?.map((card: any, i: number) => (
                                    <div key={i} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                                        <p className="font-bold text-[10px] uppercase opacity-70 mb-1 tracking-widest text-primary-200">Question</p>
                                        <p className="text-sm font-medium mb-3">{card.q}</p>
                                        <p className="font-bold text-[10px] uppercase opacity-70 mb-1 tracking-widest text-green-300">Answer</p>
                                        <p className="text-sm border-l-2 border-white/20 pl-2 opacity-90">{card.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border dark:border-gray-800 space-y-4 border-l-4 border-l-orange-500">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                                <HelpCircle className="w-5 h-5 text-orange-500" />
                                <span>Possible Exam Questions</span>
                            </h3>
                            <div className="space-y-3">
                                {summary.mockQuestions?.map((q: string, i: number) => (
                                    <div key={i} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                        {q}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

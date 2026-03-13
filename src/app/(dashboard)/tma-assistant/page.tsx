"use client";

import { useState, useEffect, Suspense } from "react";
import { Sparkles, Languages, Copy, FileSearch, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

function TmaContent() {
    const searchParams = useSearchParams();
    const [question, setQuestion] = useState("");
    const [hausaToggle, setHausaToggle] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const course = searchParams.get("course");
        if (course) {
            setQuestion(`Help me analyze the TMA for ${course}: `);
        }
    }, [searchParams]);

    const handleAnalyze = async () => {
        if (!question) return;
        setAnalyzing(true);
        setError(null);
        try {
            const response = await fetch("/api/tma/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, includeHausa: hausaToggle }),
            });

            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border dark:border-gray-800 space-y-6">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI TMA Assistant</h2>
                        <p className="text-gray-500 dark:text-gray-400">Paste your question below for instant analysis and structure suggestions.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <textarea
                    className="w-full h-48 p-4 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 transition outline-none resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Paste TMA question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setHausaToggle(!hausaToggle)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${hausaToggle ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
                    >
                        <Languages className="w-4 h-4" />
                        <span>Hausa Explanation {hausaToggle ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                        onClick={handleAnalyze}
                        disabled={!question || analyzing}
                        className="flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        {analyzing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <FileSearch className="w-5 h-5" />
                        )}
                        <span>{analyzing ? "Analyzing..." : "Analyze Question"}</span>
                    </button>
                </div>
            </div>

            {result && (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border-2 border-primary-100 dark:border-primary-900 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                                <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                                <span>Question Breakdown</span>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">{result.breakdown}</p>

                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2 pt-2">
                                <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                                <span>Suggested Structure</span>
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 pl-4">
                                {result.structure?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                                <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                                <span>Key Concepts</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.concepts?.map((c: string, i: number) => (
                                    <span key={i} className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">#{c}</span>
                                ))}
                            </div>

                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2 pt-2">
                                <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                                <span>APA Reference</span>
                            </h3>
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <code className="text-xs text-gray-700 dark:text-gray-300">{result.references}</code>
                                <button className="text-gray-400 hover:text-primary-600 transition">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            {result.hausa && (
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 mt-4">
                                    <h4 className="font-bold text-green-800 dark:text-green-400 text-sm mb-1 uppercase tracking-wider">Hausa Interpretation</h4>
                                    <p className="text-sm text-green-700 dark:text-green-300">{result.hausa}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TmaClient() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-12 text-gray-500">Loading Assistant...</div>}>
            <TmaContent />
        </Suspense>
    );
}

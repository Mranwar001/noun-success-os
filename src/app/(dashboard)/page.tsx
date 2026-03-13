"use client";

import { useEffect, useState } from "react";
import { Loader2, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardClient() {
  const [stats, setStats] = useState({
    coursesCount: 0,
    pendingTmas: 3,
    daysToExam: 0,
    progress: 65,
  });
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setCourses(data);
        let days = 0;
        if (data.length > 0) {
          const dates = data
            .map((c: any) => c.exam_date)
            .filter((d: any) => d)
            .map((d: any) => new Date(d).getTime());
          if (dates.length > 0) {
            const minDate = Math.min(...dates);
            days = Math.ceil((minDate - Date.now()) / (1000 * 60 * 60 * 24));
          }
        }
        setStats(prev => ({
          ...prev,
          coursesCount: data.length,
          daysToExam: days > 0 ? days : 0,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Synchronizing your academic data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Academic Overview</h2>
        <p className="text-gray-500 dark:text-gray-400">Stay on top of your semester goals and deadlines.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm border dark:border-gray-800 group hover:border-primary-200 transition-colors">
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Enrolled Courses</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.coursesCount}</p>
            <BookOpen className="w-6 h-6 text-primary-200 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm border dark:border-gray-800 group hover:border-primary-200 transition-colors text-primary-600 dark:text-primary-400">
          <p className="text-xs font-black text-primary-300 dark:text-primary-900 uppercase tracking-widest">Pending TMAs</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-4xl font-black">{stats.pendingTmas}</p>
            <AlertCircle className="w-6 h-6 text-primary-200 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm border dark:border-gray-800 group hover:border-orange-200 transition-colors text-orange-600 dark:text-orange-400">
          <p className="text-xs font-black text-orange-300 dark:text-orange-900 uppercase tracking-widest">Exam Countdown</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-4xl font-black">{stats.daysToExam}</p>
            <div className="text-xs font-bold bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">DAYS LEFT</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm border dark:border-gray-800 group hover:border-green-200 transition-colors">
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Semester Progress</p>
          <div className="mt-4 flex flex-col items-end">
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xs font-black text-green-600 dark:text-green-500 italic">{stats.progress}% Completed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-sm border dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-l-4 border-primary-500 pl-3">Active Course Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="pb-3">Course</th>
                  <th className="pb-3">Exam Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-gray-400 dark:text-gray-500 italic">No courses added yet.</td>
                  </tr>
                )}
                {courses.map((course) => (
                  <tr key={course.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{course.course_code}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{course.course_title}</p>
                    </td>
                    <td className="py-4">
                      {course.exam_date ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                          {new Date(course.exam_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 italic uppercase">TBD</span>
                      )}
                    </td>
                    <td className="py-4">
                      <Link href="/courses" className="text-xs font-black text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 uppercase tracking-widest">Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-primary-600 p-8 shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
          <TrendingUp className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12" />
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold">Smart Analysis</h3>
            <p className="text-sm text-primary-100 opacity-80 leading-relaxed">
              Students who use regular mock exams score 40% higher on average.
            </p>
          </div>
          <Link href="/exams" className="mt-8 relative z-10 bg-white text-primary-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-50 transition-colors text-center block">
            Try a Mock Exam
          </Link>
        </div>
      </div>
    </div>
  );
}

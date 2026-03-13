"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Book, Loader2 } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    course_code: "",
    course_title: "",
    units: "2",
    exam_date: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCourses(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCourses([data, ...courses]);
      setShowAddModal(false);
      setNewCourse({ course_code: "", course_title: "", units: "2", exam_date: "" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCourses(courses.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Manager</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Organize your semester syllabus and exam dates.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-lg shadow-primary-100"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {loading && courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading your courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 && (
            <div className="col-span-full bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center">
              <Book className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white font-bold">No courses found</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Click "Add Course" to get started with your semester.</p>
            </div>
          )}
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 space-y-4 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{course.course_code}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{course.course_title || "Untitled Course"}</h3>
                </div>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Book className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span>{course.units} Credit Units</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span>Exam: {course.exam_date ? new Date(course.exam_date).toLocaleDateString() : "Not set"}</span>
                </div>
              </div>
              <div className="pt-4 border-t dark:border-gray-800 flex justify-end items-center">
                <button className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline uppercase tracking-widest">
                  View TMAs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Enroll New Course</h3>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Course Code</label>
                <input
                  required
                  placeholder="e.g. GST101"
                  className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition"
                  value={newCourse.course_code}
                  onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Course Title</label>
                <input
                  placeholder="e.g. Use of English"
                  className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition"
                  value={newCourse.course_title}
                  onChange={(e) => setNewCourse({ ...newCourse, course_title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Units</label>
                  <select
                    className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition"
                    value={newCourse.units}
                    onChange={(e) => setNewCourse({ ...newCourse, units: e.target.value })}
                  >
                    <option value="1">1 Unit</option>
                    <option value="2">2 Units</option>
                    <option value="3">3 Units</option>
                    <option value="4">4 Units</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Exam Date</label>
                  <input
                    type="date"
                    className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition"
                    value={newCourse.exam_date}
                    onChange={(e) => setNewCourse({ ...newCourse, exam_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border dark:border-gray-700 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-100 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

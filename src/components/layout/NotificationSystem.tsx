"use client";

import { useEffect, useState } from "react";
import { Bell, AlertCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkDeadlines() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch courses and TMAs
      const { data: courses } = await supabase.from("courses").select("id, course_code").eq("user_id", user.id);
      
      if (!courses || courses.length === 0) return;

      const courseIds = courses.map(c => c.id);
      const { data: tmas } = await supabase
        .from("tmas")
        .select("*, courses(course_code)")
        .in("course_id", courseIds)
        .eq("status", "pending");

      if (!tmas) return;

      const activeNotifications: any[] = [];
      const now = new Date();

      tmas.forEach(tma => {
        const deadline = new Date(tma.deadline);
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 7 && diffDays > 0) {
          activeNotifications.push({
            id: tma.id,
            title: `Approaching Deadline: ${tma.courses.course_code}`,
            message: `${tma.title} is due in ${diffDays} days!`,
            type: "warning",
            date: tma.deadline
          });
        } else if (diffDays <= 0) {
           activeNotifications.push({
            id: tma.id,
            title: `Deadline Passed: ${tma.courses.course_code}`,
            message: `${tma.title} deadline has been reached.`,
            type: "danger",
            date: tma.deadline
          });
        }
      });

      setNotifications(activeNotifications);
    }

    checkDeadlines();
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
      >
        <Bell className={`w-6 h-6 ${notifications.length > 0 ? 'text-primary-600 dark:text-primary-400 animate-swing' : 'text-gray-400 dark:text-gray-500'}`} />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 dark:bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 dark:bg-red-600"></span>
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center transition-colors">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Notifications</h4>
            <button className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase">Clear All</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-400 dark:text-gray-500">All clear! No pending alerts.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${n.type === 'warning' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                    {n.type === 'warning' ? <Clock className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 text-center transition-colors">
              <button className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">View All Updates</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

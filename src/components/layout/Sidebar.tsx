"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  GraduationCap, 
  Settings,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import SignOutButton from "./SignOutButton";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "AI TMA Assistant", href: "/tma-assistant", icon: BrainCircuit },
  { name: "Book Summarizer", href: "/summarizer", icon: FileText },
  { name: "E-Exam Simulator", href: "/exams", icon: GraduationCap },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-colors">
      <div className="flex h-16 items-center px-6 border-b dark:border-gray-800">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-500">NOUN Success OS</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              )}
            >
              <item.icon
                className={cn(
                  isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300",
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t dark:border-gray-800 p-4 space-y-1">
        <Link
          href="/settings"
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
          Settings
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}

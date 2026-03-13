import Sidebar from "@/components/layout/Sidebar";
import NotificationSystem from "@/components/layout/NotificationSystem";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between px-8 transition-colors">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Dashboard</h2>
                    <div className="flex items-center space-x-6">
                        <ThemeToggle />
                        <NotificationSystem />
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Welcome, Student</span>
                            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                S
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 dark:bg-gray-950 transition-colors">
                    {children}
                </main>
            </div>
        </div>
    );
}

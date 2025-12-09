import { BookOpen } from 'lucide-react';
import Header from './Header';
interface LayoutProps {
  children: React.ReactNode;
  user?: {
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
  } | null;
}
export default function Layout({ children, user }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Header user={user} />
      <main className="max-w-7xl mx-auto">{children}</main>
      <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold font-serif text-black dark:text-white mb-4">
                <BookOpen className="w-6 h-6" />
                LMS
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Your Journey To Knowledge Starts Here!
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
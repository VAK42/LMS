import { BookOpen } from 'lucide-react';
import Header from './Header';
import useTranslation from '../hooks/useTranslation';
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
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header user={user} />
      <main className="mx-auto">{children}</main>
      <footer className="border-t border-green-950 dark:border-white bg-white dark:bg-black">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-serif text-black dark:text-white mb-4">
                <BookOpen className="w-6 h-6" />
                {t('lms')}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t('footerText')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
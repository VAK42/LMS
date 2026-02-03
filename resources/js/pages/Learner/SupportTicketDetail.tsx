import { ArrowLeft, Clock, Send, User } from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Reply {
  replyId: number;
  message: string;
  isStaffReply: boolean;
  createdAt: string;
  user: {
    name: string;
  };
}
interface Ticket {
  ticketId: number;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  replies: Reply[];
}
interface Props {
  ticket: Ticket;
  user: any;
}
export default function SupportTicketDetail({ ticket, user }: Props) {
  const { t } = useTranslation();
  const { data, setData, post, processing, reset } = useForm({
    message: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/api/supportTickets/${ticket.ticketId}/reply`, {
      onSuccess: () => reset(),
    });
  };
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700';
      case 'inProgress': return 'bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900';
      case 'resolved': return 'bg-green-50 dark:bg-zinc-800 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900';
      case 'closed': return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700';
      default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
    }
  };
  return (
    <Layout user={user}>
      <Head title={ticket.subject} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/supportTickets"
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-green-950 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToTickets')}
        </Link>
        <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white p-8 mb-8 rounded">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-serif text-green-950 dark:text-white mb-2">{ticket.subject}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-4 h-4" />
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 text-xs rounded ${getStatusStyle(ticket.status)}`}>
                  {t(ticket.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{ticket.message}</p>
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-serif text-green-950 dark:text-white">{t('repliesHeader', { count: ticket.replies?.length || 0 })}</h2>
          {ticket.replies && ticket.replies.length > 0 ? (
            ticket.replies.map((reply) => (
              <div
                key={reply.replyId}
                className={`p-6 border rounded ${reply.isStaffReply ? 'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700' : 'bg-white dark:bg-zinc-900 border-green-950 dark:border-white'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="font-medium text-green-950 dark:text-white">
                    {reply.isStaffReply ? t('supportStaff') : reply.user?.name || t('you')}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{reply.message}</p>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">{t('noRepliesYet')}</p>
          )}
        </div>
        {ticket.status !== 'closed' && (
          <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white p-6 rounded">
            <h3 className="text-lg font-serif text-green-950 dark:text-white mb-4">{t('addReply')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                rows={4}
                placeholder={t('typeYourMessage')}
                className="w-full px-4 py-3 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white resize-none rounded"
                required
              />
              <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors cursor-pointer disabled:opacity-50 rounded"
              >
                <Send className="w-4 h-4" />
                {t('sendReply')}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  )
}
import { MessageSquare, Plus, Clock, ChevronRight } from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../components/Layout';
import useTranslation from '../../hooks/useTranslation';
interface Ticket {
  ticketId: number;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  replies: any[];
}
interface Props {
  tickets: Ticket[];
  user: any;
}
export default function SupportTickets({ tickets, user }: Props) {
  const { t } = useTranslation();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const { data, setData, post, processing } = useForm({
    subject: '',
    message: '',
    priority: 'medium',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/api/supportTickets', {
      onSuccess: () => {
        setShowNewTicket(false);
        setData({ subject: '', message: '', priority: 'medium' });
      },
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
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-zinc-600 dark:text-zinc-400 font-medium';
      case 'low': return 'text-zinc-500 dark:text-zinc-500';
      default: return 'text-zinc-600 dark:text-zinc-400';
    }
  };
  return (
    <Layout user={user}>
      <Head title={t('supportTickets')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif text-green-950 dark:text-white mb-2">{t('supportTickets')}</h1>
            <p className="text-zinc-600 dark:text-zinc-400">{t('getHelp')}</p>
          </div>
          <button
            onClick={() => setShowNewTicket(!showNewTicket)}
            className="flex items-center gap-2 px-6 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors cursor-pointer rounded"
          >
            <Plus className="w-5 h-5" />
            {t('newTicket')}
          </button>
        </div>
        {showNewTicket && (
          <div className="bg-white dark:bg-zinc-900 border border-green-950 dark:border-white p-8 mb-8 rounded">
            <h2 className="text-2xl font-serif text-green-950 dark:text-white mb-6">{t('createNewTicket')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-950 dark:text-white mb-2">{t('subject')}</label>
                <input
                  type="text"
                  value={data.subject}
                  onChange={(e) => setData('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-950 dark:text-white mb-2">{t('priority')}</label>
                <select
                  value={data.priority}
                  onChange={(e) => setData('priority', e.target.value)}
                  className="w-full px-4 py-3 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white rounded"
                >
                  <option value="low">{t('low')}</option>
                  <option value="medium">{t('medium')}</option>
                  <option value="high">{t('high')}</option>
                  <option value="urgent">{t('urgent')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-950 dark:text-white mb-2">{t('message')}</label>
                <textarea
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-green-950 dark:border-white bg-white dark:bg-zinc-900 text-green-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-950 dark:focus:ring-white resize-none rounded"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-3 bg-green-950 dark:bg-white text-white dark:text-green-950 font-medium hover:bg-white hover:text-green-950 hover:border-green-950 dark:hover:bg-green-950 dark:hover:text-white dark:hover:border-green-950 border border-transparent transition-colors cursor-pointer disabled:opacity-50 rounded"
                >
                  {t('submitTicket')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="px-8 py-3 border border-green-950 dark:border-white text-green-950 dark:text-white hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer rounded"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Link
              key={ticket.ticketId}
              href={`/supportTickets/${ticket.ticketId}`}
              className="block bg-white dark:bg-zinc-900 border border-green-950 dark:border-white p-6 hover:border-green-800 dark:hover:border-zinc-200 transition-colors group rounded"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-serif text-green-950 dark:text-white mb-2 group-hover:underline">{ticket.subject}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                      <Clock className="w-4 h-4" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded ${getStatusStyle(ticket.status)}`}>
                      {t(ticket.status)}
                    </span>
                    <span className={`text-xs ${getPriorityStyle(ticket.priority)}`}>
                      {t(ticket.priority)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('repliesCount', { count: ticket.replies?.length || 0 })}
                  </span>
                  <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-green-950 dark:group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-green-950 dark:border-white rounded">
              <MessageSquare className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
              <h3 className="text-xl font-serif text-green-950 dark:text-white mb-2">{t('noSupportTickets')}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{t('createTicketToGetHelp')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
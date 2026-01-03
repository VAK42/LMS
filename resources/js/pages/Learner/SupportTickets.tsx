import { MessageSquare, Plus, Clock, ChevronRight } from 'lucide-react';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../components/Layout';
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
      case 'open': return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300';
      case 'inProgress': return 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200';
      case 'resolved': return 'bg-black dark:bg-white text-white dark:text-black';
      case 'closed': return 'bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300';
      default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
    }
  };
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-black dark:text-white font-bold';
      case 'high': return 'text-zinc-800 dark:text-zinc-200 font-semibold';
      case 'medium': return 'text-zinc-600 dark:text-zinc-400';
      case 'low': return 'text-zinc-500 dark:text-zinc-500';
      default: return 'text-zinc-600 dark:text-zinc-400';
    }
  };
  return (
    <Layout user={user}>
      <Head title="Support Tickets" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-black dark:text-white mb-2">Support Tickets</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Get Help From Our Support Team</p>
          </div>
          <button
            onClick={() => setShowNewTicket(!showNewTicket)}
            className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            New Ticket
          </button>
        </div>
        {showNewTicket && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-black dark:text-white mb-6">Create New Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">Subject</label>
                <input
                  type="text"
                  value={data.subject}
                  onChange={(e) => setData('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">Priority</label>
                <select
                  value={data.priority}
                  onChange={(e) => setData('priority', e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">Message</label>
                <textarea
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white resize-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="px-8 py-3 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
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
              className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 hover:border-black dark:hover:border-white transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-black dark:text-white mb-2 group-hover:underline">{ticket.subject}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                      <Clock className="w-4 h-4" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium ${getStatusStyle(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-xs ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {ticket.replies?.length || 0} Replies
                  </span>
                  <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <MessageSquare className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
              <h3 className="text-xl font-serif font-bold text-black dark:text-white mb-2">No Support Tickets Yet</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Create A Ticket To Get Help From Our Team</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
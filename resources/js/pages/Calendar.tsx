import { Head } from '@inertiajs/react';
import { Clock, Video, Target, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  date: string;
  duration?: number;
  course: string;
  meetingLink?: string;
  allowLate?: boolean;
}
interface CalendarProps {
  events: Event[];
  user: any;
}
export default function Calendar({ events, user }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const getEventsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return events.filter(event => event.date.startsWith(dateStr));
  };
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Target className="w-4 h-4" />;
      case 'liveSession': return <Video className="w-4 h-4" />;
      case 'milestone': return <Bell className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };
  const getEventColor = (type: string) => {
    switch (type) {
      case 'deadline': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'liveSession': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'milestone': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      default: return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    }
  };
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  return (
    <Layout user={user}>
      <Head title="Calendar" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Course Calendar
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDate(day);
                  const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                  return (
                    <div
                      key={day}
                      className={`aspect-square border border-slate-200 dark:border-slate-700 rounded-lg p-1 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'bg-white dark:bg-slate-900'}`}
                    >
                      <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}>
                        {day}
                      </div>
                      <div className="space-y-0.5 mt-1">
                        {dayEvents.slice(0, 2).map((event, idx) => (
                          <div
                            key={event.id}
                            className={`text-[10px] px-1 py-0.5 rounded truncate ${getEventColor(event.type)}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-slate-500">+{dayEvents.length - 2}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    No Upcoming Events
                  </p>
                ) : (
                  upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-xl border ${getEventColor(event.type)}`}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        {getEventIcon(event.type)}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{event.title}</p>
                          <p className="text-xs opacity-80">{event.course}</p>
                        </div>
                      </div>
                      <p className="text-xs flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {event.meetingLink && (
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline mt-1 block"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
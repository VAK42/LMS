import { Search } from 'lucide-react';
import { useState } from 'react';
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}
export default function SearchBar({ placeholder = 'Search...', onSearch, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
      />
    </form>
  )
}
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FiCalendar, FiList, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useState, useEffect, useMemo } from 'react';
import CalendarView from './_components/CalendarView';
import EventsListView from './_components/EventsListView';

type PriorityFilter = 'all' | 'NORMAL' | 'IMPORTANT' | 'CRITICAL';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'calendar';
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const updateView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if ((debouncedSearchQuery || priorityFilter !== 'all') && view !== 'list') {
      updateView('list');
    }
  }, [debouncedSearchQuery, priorityFilter, view]);

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setPriorityFilter('all');
  };

  const hasFilters = priorityFilter !== 'all';

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Events</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your schedule</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => updateView('calendar')}
                className={`p-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FiCalendar className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
              <button
                onClick={() => updateView('list')}
                className={`p-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FiList className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {view === 'list' && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                  className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="IMPORTANT">Important</option>
                  <option value="NORMAL">Normal</option>
                </select>
                <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 p-8 bg-gray-50 overflow-auto">
        {view === 'calendar' ? (
          <CalendarView />
        ) : (
          <div className="max-w-4xl mx-auto">
            <EventsListView
              searchQuery={debouncedSearchQuery}
              priorityFilter={priorityFilter}
            />
          </div>
        )}
      </div>
    </div>
  );
}
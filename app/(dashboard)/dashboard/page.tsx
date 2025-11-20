'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FiCalendar, FiList, FiSearch, FiFilter } from 'react-icons/fi';
import CalendarView from './_components/CalendarView';
import EventsListView from './_components/EventsListView';

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'calendar'

  const updateView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', newView)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Events</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your schedule</p>
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

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer">
                <option>All Priorities</option>
                <option>Critical</option>
                <option>Important</option>
                <option>Normal</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FiFilter className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-8 bg-gray-50 overflow-auto">
        {view === 'calendar' ? (
          <CalendarView />
        ) : (
          <div className="max-w-4xl mx-auto">
            <EventsListView />
          </div>
        )}
      </div>
    </div>
  )
}

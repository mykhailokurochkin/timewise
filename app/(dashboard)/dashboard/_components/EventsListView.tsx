'use client'

import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/app/actions/events.actions';
import { format } from 'date-fns';

type Event = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  priority: 'NORMAL' | 'IMPORTANT' | 'CRITICAL';
  createdAt: Date;
  updatedAt: Date;
};

type SerializedEvent = Omit<Event, 'startTime' | 'endTime' | 'createdAt' | 'updatedAt'> & {
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export default function EventsListView() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const data = await getEvents();
      return data.map(event => ({
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-20" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
        <div className="mx-auto h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
        <p className="text-gray-500 mt-1">Create your first event to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
              {event.description && (
                <p className="mt-1 text-gray-600">{event.description}</p>
              )}
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <time dateTime={event.startTime.toISOString()}>
                  {format(event.startTime, 'MMM d, yyyy h:mm a')}
                </time>
                <span className="mx-2">-</span>
                <time dateTime={event.endTime.toISOString()}>
                  {format(event.endTime, 'MMM d, yyyy h:mm a')}
                </time>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              event.priority === 'CRITICAL' 
                ? 'bg-red-100 text-red-800' 
                : event.priority === 'IMPORTANT' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
            }`}>
              {event.priority.charAt(0) + event.priority.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

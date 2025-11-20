'use client'

import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/app/actions/events.actions';
import { format } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { EventCard } from './EventCard';

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

type EventsListViewProps = {
  searchQuery?: string;
  priorityFilter?: string;
};

export default function EventsListView({
  searchQuery = '',
  priorityFilter = 'all'
}: EventsListViewProps) {
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

  const [searchValue, setSearchValue] = useState(searchQuery);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchQuery);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchValue(value);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter((event: Event) => {
      const matchesSearch =
        debouncedSearchValue === '' ||
        event.title.toLowerCase().includes(debouncedSearchValue.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(debouncedSearchValue.toLowerCase()));

      const matchesPriority =
        priorityFilter === 'all' ||
        event.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [events, debouncedSearchValue, priorityFilter]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-20" />
        ))}
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
        <div className="mx-auto h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No events found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search or create a new event</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

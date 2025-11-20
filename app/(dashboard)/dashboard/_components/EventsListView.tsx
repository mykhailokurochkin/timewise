'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getEvents, updateEvent } from '@/app/actions/events.actions';
import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { format } from 'date-fns';
import { EventCard } from './EventCard';
import EventModal from '../../_components/EventModal';

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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateEventMutation = useMutation({
    mutationFn: async (eventData: {
      title: string;
      description: string;
      startTime: string;
      endTime: string;
      priority: 'low' | 'medium' | 'high';
    }) => {
      if (!editingEvent) return;

      const formData = new FormData();
      formData.append('title', eventData.title);
      formData.append('description', eventData.description);
      formData.append('startTime', eventData.startTime);
      formData.append('endTime', eventData.endTime);
      formData.append('priority',
        eventData.priority === 'low' ? 'NORMAL' :
          eventData.priority === 'high' ? 'CRITICAL' : 'IMPORTANT'
      );

      return updateEvent(editingEvent.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsModalOpen(false);
      setEditingEvent(null);
    },
  });

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSubmitEdit = (eventData: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    updateEventMutation.mutate(eventData);
  };
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
    <>
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={handleEditEvent}
          />
        ))}
      </div>

      {editingEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onSubmit={handleSubmitEdit}
          isLoading={updateEventMutation.isPending}
          selectedDate={new Date(editingEvent.startTime)}
          initialData={{
            title: editingEvent.title,
            description: editingEvent.description || '',
            startTime: format(editingEvent.startTime, "yyyy-MM-dd'T'HH:mm"),
            endTime: format(editingEvent.endTime, "yyyy-MM-dd'T'HH:mm"),
            priority: editingEvent.priority === 'CRITICAL' ? 'high' :
              editingEvent.priority === 'IMPORTANT' ? 'medium' : 'low'
          }}
        />
      )}
    </>
  );
}

import { format } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEvent } from '@/app/actions/events.actions';
import { useState, useCallback } from 'react';
import ConfirmModal from '../../_components/ConfirmModal';
import { Event } from '@/types/Event';

export const QUERY_KEYS = {
  EVENTS: 'events',
} as const;

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
}

export function EventCard({ event, onEdit }: EventCardProps) {
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteEvent(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.error('Failed to delete event:', error);
    },
  });

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteModal(true);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group relative">

      <div className="absolute right-3 top-3 flex gap-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(event);
          }}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
          aria-label="Edit event"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleDeleteClick}
          disabled={deleteMutation.isPending}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 disabled:opacity-50"
          aria-label="Delete event"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => deleteMutation.mutate()}
          title="Delete Event"
          description="Are you sure you want to delete this event? This action cannot be undone."
          confirmText="Delete Event"
          isDanger
          isLoading={deleteMutation.isPending}
        />
      </div>

      <div className="relative w-full">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
          {event.description && (
            <p className="mt-1 text-gray-600">{event.description}</p>
          )}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <time dateTime={event.startTime.toISOString()}>
                {format(event.startTime, 'MMM d, yyyy h:mm a')}
              </time>
              <span className="mx-2">-</span>
              <time dateTime={event.endTime.toISOString()}>
                {format(event.endTime, 'h:mm a')}
              </time>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${event.priority === 'CRITICAL'
                ? 'bg-red-100 text-red-800'
                : event.priority === 'IMPORTANT'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
                }`}
            >
              {event.priority.charAt(0) + event.priority.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
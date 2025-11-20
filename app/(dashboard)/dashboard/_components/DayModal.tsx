'use client'

import { Event } from '@/types/Event';
import { format } from 'date-fns';
import { X, Pencil, Trash2, Check, X as XIcon } from 'lucide-react';
import { useState } from 'react';

interface DayModalProps {
  date: Date
  events: Event[]
  onClose: () => void
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  isDeleting?: string | null
}

export function DayModal({
  date,
  events,
  onClose,
  onEdit,
  onDelete,
  isDeleting
}: DayModalProps) {
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-50 border-red-200 text-red-800'
      case 'IMPORTANT': return 'bg-amber-50 border-amber-200 text-amber-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events scheduled for this day
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{event.title}</h4>
                    <span className="text-sm text-gray-500">
                      {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                    </span>
                  </div>
                  {event.description && (
                    <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                  )}
                  <div className="mt-3 flex justify-between items-center">
                    <span className={`text-xs px-3 py-1 rounded-md font-medium ${
                      event.priority === 'CRITICAL'
                        ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-200'
                        : event.priority === 'IMPORTANT'
                        ? 'bg-white text-amber-600 shadow-sm ring-1 ring-amber-200'
                        : 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-200'
                    }`}>
                      {event.priority.charAt(0) + event.priority.slice(1).toLowerCase()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(event);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label="Edit event"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {deletingEventId === event.id ? (
                        <div className="flex items-center gap-1 bg-red-50 rounded-full px-2 py-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(event.id);
                              setDeletingEventId(null);
                            }}
                            disabled={isDeleting === event.id}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
                            aria-label="Confirm delete"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingEventId(null);
                            }}
                            disabled={isDeleting === event.id}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                            aria-label="Cancel delete"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingEventId(event.id);
                          }}
                          disabled={isDeleting === event.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          aria-label="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

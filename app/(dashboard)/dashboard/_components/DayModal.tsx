'use client'

import { format } from 'date-fns';
import { X } from 'lucide-react';

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  priority: 'NORMAL' | 'IMPORTANT' | 'CRITICAL'
}

interface DayModalProps {
  date: Date
  events: CalendarEvent[]
  onClose: () => void
}

export function DayModal({ date, events, onClose }: DayModalProps) {
  const getPriorityColor = (priority: string) => {
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
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.priority === 'CRITICAL'
                        ? 'bg-red-100 text-red-800'
                        : event.priority === 'IMPORTANT'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.priority.charAt(0) + event.priority.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

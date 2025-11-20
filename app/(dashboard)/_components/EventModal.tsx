'use client'

import { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

export type EventFormData = {
  title: string
  description: string
  startTime: string
  endTime: string
  priority: 'low' | 'medium' | 'high'
}

type EventModalProps = {
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
  onSubmit: (eventData: EventFormData) => void
  initialData?: EventFormData
  selectedDate: Date | null
}

export default function EventModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false, 
  initialData 
}: EventModalProps) {
  type Priority = 'low' | 'medium' | 'high'

  const formatTimeFromISO = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toTimeString().slice(0, 5);
  };

  const getDefaultTimes = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    return {
      start: now.toTimeString().slice(0, 5),
      end: oneHourLater.toTimeString().slice(0, 5)
    };
  };

  const [time, setTime] = useState({
    start: initialData ? formatTimeFromISO(initialData.startTime) : getDefaultTimes().start,
    end: initialData ? formatTimeFromISO(initialData.endTime) : getDefaultTimes().end
  });

  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      priority: 'medium',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const baseDate = new Date();
    
    const [startHours, startMinutes] = time.start.split(':').map(Number);
    const startDateTime = new Date(baseDate);
    startDateTime.setHours(startHours, startMinutes, 0, 0);
    
    const [endHours, endMinutes] = time.end.split(':').map(Number);
    const endDateTime = new Date(baseDate);
    endDateTime.setHours(endHours, endMinutes, 0, 0);
    
    if (endDateTime <= startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }
    
    onSubmit({
      ...formData,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      priority: formData.priority as 'low' | 'medium' | 'high'
    })
  }

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTime({
        start: formatTimeFromISO(initialData.startTime),
        end: formatTimeFromISO(initialData.endTime)
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        priority: 'medium',
      });
      setTime(getDefaultTimes());
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Event title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Event description (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                id="startTime"
                required
                value={time.start}
                onChange={(e) => {
                  setTime(prev => ({
                    ...prev,
                    start: e.target.value
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                id="endTime"
                required
                min={time.start}
                value={time.end}
                onChange={(e) => {
                  setTime(prev => ({
                    ...prev,
                    end: e.target.value
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => {
                const value = e.target.value as Priority;
                setFormData(prev => ({ ...prev, priority: value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? 'Saving...' 
                : initialData 
                  ? 'Save Changes' 
                  : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

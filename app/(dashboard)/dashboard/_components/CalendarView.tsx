'use client'

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { getEvents } from '@/app/actions/events.actions'
import { DayModal } from './DayModal';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO
} from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { clsx } from 'clsx';

type ApiEvent = {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  priority: 'NORMAL' | 'IMPORTANT' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type Event = Omit<ApiEvent, 'startTime' | 'endTime' | 'createdAt' | 'updatedAt'> & {
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDayModal, setShowDayModal] = useState(false);
  
  const { data: events = [], isLoading } = useQuery<Event[]>({
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

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.startTime, day))
  }

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    setShowDayModal(true)
  };
  
  const getPriorityColor = (priority: string, type: 'bg' | 'text' | 'border' = 'bg') => {
    const colors = {
      CRITICAL: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-300',
        hover: 'hover:bg-red-100',
        dot: 'bg-red-500',
      },
      IMPORTANT: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-300',
        hover: 'hover:bg-amber-100',
        dot: 'bg-amber-500',
      },
      NORMAL: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-300',
        hover: 'hover:bg-blue-100',
        dot: 'bg-blue-500',
      },
    };
    
    const selected = colors[priority as keyof typeof colors] || colors.NORMAL;
    return selected[type as keyof typeof selected] || '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="text-sm text-gray-500">
            Today is {format(new Date(), 'EEEE, MMMM d')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-indigo-100 hover:border-indigo-200 mr-2"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day) => (
          <div key={day} className="text-sm font-semibold text-center text-gray-600 py-1.5">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, monthStart)
          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={clsx(
                "bg-white min-h-[100px] p-1.5 relative transition-colors flex flex-col cursor-pointer hover:bg-gray-50",
                !isCurrentMonth && 'bg-gray-50/50 text-gray-400',
                isToday(day) && 'bg-blue-50/50'
              )}
            >
              <div className="flex justify-between items-start">
                <span
                  className={clsx(
                    'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full',
                    isToday(day)
                      ? 'bg-indigo-600 text-white'
                      : isCurrentMonth ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="mt-0.5 space-y-1 flex-1 overflow-y-auto max-h-[calc(100%-28px)] pr-0.5">
                {getEventsForDay(day).slice(0, 4).map((event: Event) => (
                  <div 
                    key={event.id}
                    className={clsx(
                      'text-[11px] p-1.5 rounded transition-all duration-150 cursor-pointer',
                      'flex items-start gap-1.5 border',
                      getPriorityColor(event.priority, 'bg'),
                      getPriorityColor(event.priority, 'text'),
                      getPriorityColor(event.priority, 'border'),
                      getPriorityColor(event.priority, 'hover' as any),
                      'group hover:shadow-xs',
                      'overflow-hidden',
                    )}
                  >
                    <div className={clsx(
                      'w-1.5 h-1.5 rounded-full mt-1 shrink-0',
                      getPriorityColor(event.priority, 'dot' as any)
                    )} />
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="font-medium truncate leading-tight">
                        {event.title}
                      </div>
                      <div className={clsx(
                        'text-[10px] opacity-80 flex items-center',
                        getPriorityColor(event.priority, 'text')
                      )}>
                        {format(event.startTime, 'HH:mm')}
                        {event.endTime && `-${format(event.endTime, 'HH:mm')}`}
                      </div>
                    </div>
                  </div>
                ))}
                {getEventsForDay(day).length > 4 && (
                  <div className="text-[10px] text-gray-500 text-center py-0.5 px-1.5 bg-gray-50 rounded border border-gray-200 mt-0.5">
                    +{getEventsForDay(day).length - 4} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showDayModal && selectedDate && (
        <DayModal
          date={selectedDate}
          events={getEventsForDay(selectedDate)}
          onClose={() => setShowDayModal(false)}
        />
      )}
    </div>
  )
}

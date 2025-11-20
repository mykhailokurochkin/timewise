'use client'

import { useState } from 'react'
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
  isToday
} from 'date-fns'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { clsx } from 'clsx'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Generate calendar grid
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  })

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors mr-2"
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

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b border-gray-200">
        {/* Weekday Headers */}
        {weekDays.map((day) => (
          <div key={day} className="bg-gray-50 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, monthStart)
          return (
            <div
              key={day.toString()}
              className={clsx(
                'bg-white min-h-[100px] p-2 relative transition-colors hover:bg-gray-50 flex flex-col',
                !isCurrentMonth && 'bg-gray-50/50 text-gray-400'
              )}
            >
              <div className="flex justify-between items-start">
                <span
                  className={clsx(
                    'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                    isToday(day)
                      ? 'bg-indigo-600 text-white'
                      : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Events Placeholder */}
              <div className="mt-1 space-y-1 flex-1">
                {/* Events will be mapped here */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

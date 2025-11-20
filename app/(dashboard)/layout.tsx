'use client'

import { FiCalendar, FiUser, FiLogOut, FiPlus } from 'react-icons/fi'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import EventModal from './_components/EventModal'
import { createEvent } from '../actions/events.actions'

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient();

  const user = {
    name: session?.user?.name || 'User',
    email: session?.user?.email || ''
  }

  const createEventMutation = useMutation({
    mutationFn: async (eventData: {
      title: string
      description: string
      startTime: string
      endTime: string
      priority: 'low' | 'medium' | 'high'
    }) => {
      const priorityMap = {
        'low': 'NORMAL',
        'medium': 'IMPORTANT',
        'high': 'CRITICAL'
      } as const;

      const formData = new FormData();
      formData.append('title', eventData.title);
      formData.append('description', eventData.description);
      formData.append('startTime', eventData.startTime);
      formData.append('endTime', eventData.endTime);
      formData.append('priority', priorityMap[eventData.priority]);

      return createEvent(formData);
    },
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ['events'] });

      const previousEvents = queryClient.getQueryData(['events']);

      queryClient.setQueryData(['events'], (old: any[] = []) => [
        ...old,
        {
          ...newEvent,
          id: Date.now().toString(),
          priority: newEvent.priority.toUpperCase(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      return { previousEvents };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['events'], context?.previousEvents);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsModalOpen(false);
    },
  });

  const handleCreateEvent = (eventData: {
    title: string
    description: string
    startTime: string
    endTime: string
    priority: 'low' | 'medium' | 'high'
  }) => {
    createEventMutation.mutate(eventData);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-10 hidden md:flex flex-col">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <FiCalendar className="h-6 w-6 text-indigo-600" />
          <span className="ml-3 text-xl font-bold text-gray-900">TimeWise</span>
        </div>

        <div className="p-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Create Event
          </button>
        </div>

        <EventModal
          isOpen={isModalOpen}
          onClose={() => !createEventMutation.isPending && setIsModalOpen(false)}
          onSubmit={handleCreateEvent}
          isLoading={createEventMutation.isPending}
        />

        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <span>Sign Out</span>
            <FiLogOut className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}

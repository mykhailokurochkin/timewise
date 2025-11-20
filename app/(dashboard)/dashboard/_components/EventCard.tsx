import { format } from 'date-fns';

export type Event = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  priority: 'NORMAL' | 'IMPORTANT' | 'CRITICAL';
  createdAt: Date;
  updatedAt: Date;
};

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
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
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.priority === 'CRITICAL'
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
  );
}

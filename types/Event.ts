export type ApiEvent = {
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

export type Event = Omit<ApiEvent, 'startTime' | 'endTime' | 'createdAt' | 'updatedAt'> & {
  id: string;
  title: string;
  description: string | null;
  priority: 'NORMAL' | 'IMPORTANT' | 'CRITICAL';
  userId: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
};
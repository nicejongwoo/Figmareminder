export type ReminderPriority = 'urgent' | 'week' | 'routine';

export type ReminderTrigger = 'time' | 'location' | 'both';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Location {
  name: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // meters
  triggerType: 'arrive' | 'leave';
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  icon: string;
  priority: ReminderPriority;
  groupId?: string;
  trigger: ReminderTrigger;
  
  // Time-based
  time?: string;
  days?: number[]; // 0-6 (Sunday-Saturday)
  
  // Location-based
  location?: Location;
  
  // Checklist
  checklist: ChecklistItem[];
  
  // Stats
  completionCount: number;
  totalShown: number;
  lastCompleted?: Date;
  createdAt: Date;
}

export interface ReminderGroup {
  id: string;
  name: string;
  icon: string;
  isPreset: boolean;
  reminderIds: string[];
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  weeklyCompletionRate: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

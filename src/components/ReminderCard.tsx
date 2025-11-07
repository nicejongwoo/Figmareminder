import { Reminder } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { MapPin, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface ReminderCardProps {
  reminder: Reminder;
  onToggleChecklistItem: (reminderId: string, itemId: string) => void;
  onClick?: () => void;
}

export function ReminderCard({ reminder, onToggleChecklistItem, onClick }: ReminderCardProps) {
  const completedCount = reminder.checklist.filter(item => item.completed).length;
  const totalCount = reminder.checklist.length;
  const completionRate = reminder.totalShown > 0 
    ? Math.round((reminder.completionCount / reminder.totalShown) * 100) 
    : 0;

  const borderColorMap = {
    urgent: 'border-l-red-500',
    week: 'border-l-yellow-500',
    routine: 'border-l-green-500',
  };

  return (
    <Card 
      className={`border-l-4 ${borderColorMap[reminder.priority]} shadow-sm hover:shadow-lg transition-all cursor-pointer bg-white`}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl mt-0.5">{reminder.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-content text-gray-900 mb-1.5">{reminder.title}</h3>
              {reminder.description && (
                <p className="text-description text-gray-600 line-clamp-2">{reminder.description}</p>
              )}
            </div>
          </div>
          
          {/* Completion Rate Badge */}
          {reminder.totalShown > 0 && (
            <div className="flex items-center gap-1 mt-1">
              {completionRate >= 80 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : completionRate >= 50 ? (
                <Badge variant="secondary" className="text-description px-2 py-0.5">{completionRate}%</Badge>
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>

        {/* Trigger Info */}
        <div className="flex flex-wrap gap-2 mt-3 ml-11">
          {(reminder.trigger === 'time' || reminder.trigger === 'both') && reminder.time && (
            <Badge variant="outline" className="text-description gap-1.5 px-2.5 py-1 border-gray-200">
              <Clock className="h-3.5 w-3.5" />
              {reminder.time}
              {reminder.days && reminder.days.length > 0 && ` · ${getDaysText(reminder.days)}`}
            </Badge>
          )}
          {(reminder.trigger === 'location' || reminder.trigger === 'both') && reminder.location && (
            <Badge variant="outline" className="text-description gap-1.5 px-2.5 py-1 border-gray-200">
              <MapPin className="h-3.5 w-3.5" />
              {reminder.location.name} ({reminder.location.triggerType === 'leave' ? '떠날 때' : '도착 시'})
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {reminder.checklist.map(item => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 pl-11"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              id={item.id}
              checked={item.completed}
              onCheckedChange={() => onToggleChecklistItem(reminder.id, item.id)}
              className="mt-0.5"
            />
            <label
              htmlFor={item.id}
              className={`flex-1 cursor-pointer select-none text-content ${
                item.completed ? 'line-through text-gray-400' : 'text-gray-900'
              }`}
            >
              {item.text}
            </label>
          </div>
        ))}

        {/* Progress */}
        {totalCount > 0 && (
          <div className="pl-11 pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-description text-gray-600">진행률</span>
              <span className="text-description text-gray-900">{completedCount}/{totalCount}</span>
            </div>
            <Progress value={(completedCount / totalCount) * 100} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getDaysText(days: number[]): string {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  if (days.length === 7) return '매일';
  if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return '평일';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return '주말';
  return days.map(d => dayNames[d]).join(', ');
}

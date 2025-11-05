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
      className={`border-l-4 ${borderColorMap[reminder.priority]} shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <span className="text-xl">{reminder.icon}</span>
            <div className="flex-1">
              <h3 className="mb-1">{reminder.title}</h3>
              {reminder.description && (
                <p className="text-sm text-gray-500">{reminder.description}</p>
              )}
            </div>
          </div>
          
          {/* Completion Rate Badge */}
          {reminder.totalShown > 0 && (
            <div className="flex items-center gap-1">
              {completionRate >= 80 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : completionRate >= 50 ? (
                <Badge variant="secondary" className="text-xs">{completionRate}%</Badge>
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>

        {/* Trigger Info */}
        <div className="flex flex-wrap gap-2 mt-2">
          {reminder.trigger === 'time' && reminder.time && (
            <Badge variant="outline" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              {reminder.time}
            </Badge>
          )}
          {reminder.trigger === 'location' && reminder.location && (
            <Badge variant="outline" className="text-xs gap-1">
              <MapPin className="h-3 w-3" />
              {reminder.location.name} ({reminder.location.triggerType === 'leave' ? '떠날 때' : '도착 시'})
            </Badge>
          )}
          {reminder.days && reminder.days.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {getDaysText(reminder.days)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {reminder.checklist.map(item => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 pl-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              id={item.id}
              checked={item.completed}
              onCheckedChange={() => onToggleChecklistItem(reminder.id, item.id)}
            />
            <label
              htmlFor={item.id}
              className={`flex-1 cursor-pointer select-none ${
                item.completed ? 'line-through text-gray-400' : ''
              }`}
            >
              {item.text}
            </label>
          </div>
        ))}

        {/* Progress */}
        {totalCount > 0 && (
          <div className="pl-8 pt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">진행률</span>
              <span className="text-xs">{completedCount}/{totalCount}</span>
            </div>
            <Progress value={(completedCount / totalCount) * 100} className="h-1.5" />
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

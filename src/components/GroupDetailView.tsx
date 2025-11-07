import { ReminderGroup, Reminder } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ReminderCard } from './ReminderCard';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface GroupDetailViewProps {
  group: ReminderGroup;
  reminders: Reminder[];
  onBack: () => void;
  onReminderClick: (reminder: Reminder) => void;
  onToggleChecklistItem: (reminderId: string, itemId: string) => void;
  onEditGroup?: () => void;
  onDeleteGroup?: () => void;
  onAddReminder?: () => void;
}

export function GroupDetailView({
  group,
  reminders,
  onBack,
  onReminderClick,
  onToggleChecklistItem,
  onEditGroup,
  onDeleteGroup,
  onAddReminder,
}: GroupDetailViewProps) {
  // Filter reminders for this group
  const groupReminders = reminders.filter((r) =>
    group.reminderIds.includes(r.id),
  );

  // Calculate group stats
  const totalReminders = groupReminders.length;
  const totalShown = groupReminders.reduce((sum, r) => sum + r.totalShown, 0);
  const totalCompleted = groupReminders.reduce(
    (sum, r) => sum + r.completionCount,
    0,
  );
  const completionRate =
    totalShown > 0 ? Math.round((totalCompleted / totalShown) * 100) : 0;

  const activeReminders = groupReminders.filter((r) => {
    const allCompleted = r.checklist.every((item) => item.completed);
    return !allCompleted;
  });

  const completedReminders = groupReminders.filter((r) => {
    const allCompleted = r.checklist.every((item) => item.completed);
    return allCompleted && r.checklist.length > 0;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {onEditGroup && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEditGroup}
                className="h-10 w-10 active:scale-95 transition-transform"
              >
                <Edit className="h-5 w-5" />
              </Button>
            )}
            {onDeleteGroup && !group.isPreset && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeleteGroup}
                className="h-10 w-10 text-red-600 hover:text-red-700 active:scale-95 transition-transform"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-5xl">{group.icon}</span>
          <div className="flex-1">
            <h1 className="mb-1">{group.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {totalReminders} 리마인더
              </Badge>
              {group.isPreset && (
                <Badge variant="outline" className="text-xs">
                  프리셋
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs text-gray-500 mb-1">완료율</div>
              <div className="text-lg">{completionRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-xs text-gray-500 mb-1">총 완료</div>
              <div className="text-lg">{totalCompleted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl mb-1">🔔</div>
              <div className="text-xs text-gray-500 mb-1">총 알림</div>
              <div className="text-lg">{totalShown}</div>
            </CardContent>
          </Card>
        </div>

        {/* Completion Progress */}
        {totalShown > 0 && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">그룹 진행도</span>
                <span className="text-sm">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reminders List */}
      <div className="flex-1 overflow-auto px-4 pb-4 space-y-4">
        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <h2 className="text-gray-600">
                진행 중 ({activeReminders.length})
              </h2>
            </div>
            <div className="space-y-3">
              {activeReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onToggleChecklistItem={onToggleChecklistItem}
                  onClick={() => onReminderClick(reminder)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <h2 className="text-gray-600">
                완료됨 ({completedReminders.length})
              </h2>
            </div>
            <div className="space-y-3">
              {completedReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onToggleChecklistItem={onToggleChecklistItem}
                  onClick={() => onReminderClick(reminder)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {groupReminders.length === 0 && (
          <Card className="mt-8">
            <CardContent className="pt-12 pb-12 text-center">
              <span className="text-5xl mb-4 block">📝</span>
              <h3 className="mb-2">리마인더가 없습니다</h3>
              <p className="text-sm text-gray-500 mb-4">
                이 그룹에 리마인더를 추가해보세요
              </p>
              {onAddReminder && (
                <Button onClick={onAddReminder} className="gap-2 active:scale-95 transition-transform">
                  <Plus className="h-4 w-4" />
                  리마인더 추가
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

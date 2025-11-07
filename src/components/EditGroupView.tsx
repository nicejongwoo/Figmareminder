import { useState, useEffect } from 'react';
import { ReminderGroup, Reminder } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, X, Check } from 'lucide-react';

interface EditGroupViewProps {
  group: ReminderGroup;
  reminders: Reminder[];
  onBack: () => void;
  onSave: (
    groupId: string,
    updates: {
      name: string;
      icon: string;
      reminderIds: string[];
    },
  ) => void;
}

const COMMON_ICONS = [
  '🚪',
  '🎮',
  '💼',
  '✈️',
  '🏠',
  '🏃',
  '💊',
  '🍽️',
  '🛒',
  '🚗',
  '🏋️',
  '📚',
  '🎯',
  '⚡',
  '🌟',
  '🎨',
  '🎵',
  '📱',
  '💻',
  '🔧',
];

export function EditGroupView({
  group,
  reminders,
  onBack,
  onSave,
}: EditGroupViewProps) {
  const [name, setName] = useState(group.name);
  const [icon, setIcon] = useState(group.icon);
  const [selectedReminderIds, setSelectedReminderIds] = useState<string[]>(
    group.reminderIds,
  );

  useEffect(() => {
    setName(group.name);
    setIcon(group.icon);
    setSelectedReminderIds(group.reminderIds);
  }, [group]);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave(group.id, {
      name: name.trim(),
      icon,
      reminderIds: selectedReminderIds,
    });

    onBack();
  };

  const toggleReminder = (reminderId: string) => {
    setSelectedReminderIds((prev) =>
      prev.includes(reminderId)
        ? prev.filter((id) => id !== reminderId)
        : [...prev, reminderId],
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'week':
        return 'bg-yellow-100 text-yellow-800';
      case 'routine':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🔴 긴급';
      case 'week':
        return '🟡 이번 주';
      case 'routine':
        return '🟢 루틴';
      default:
        return priority;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            저장
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-5xl">{icon}</div>
          <div className="flex-1">
            <h1 className="mb-1">그룹 편집</h1>
            <p className="text-sm text-gray-500">
              {selectedReminderIds.length}개 리마인더 선택됨
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="px-4 py-6 space-y-6">
          {/* Group Name */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <Label htmlFor="group-name" className="mb-2 block">
              그룹 이름
            </Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 외출 전, PC방 방문"
              disabled={group.isPreset}
              className="mb-2"
            />
            {group.isPreset && (
              <p className="text-xs text-gray-500">
                프리셋 그룹의 이름은 변경할 수 없습니다
              </p>
            )}
          </section>

          {/* Icon Selection */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <Label className="mb-3 block">아이콘 선택</Label>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-5xl">{icon}</div>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="이모지 입력"
                className="flex-1"
                maxLength={2}
              />
            </div>
            <div className="grid grid-cols-10 gap-2">
              {COMMON_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-2xl p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    icon === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </section>

          {/* Reminders Selection */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <Label>
                그룹 리마인더 ({selectedReminderIds.length})
              </Label>
              {selectedReminderIds.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReminderIds([])}
                  className="h-8 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  모두 제거
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {reminders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  리마인더가 없습니다
                </p>
              ) : (
                reminders.map((reminder) => {
                  const isSelected = selectedReminderIds.includes(
                    reminder.id,
                  );
                  const inOtherGroup =
                    reminder.groupId &&
                    reminder.groupId !== group.id;

                  return (
                    <div
                      key={reminder.id}
                      onClick={() => {
                        if (!inOtherGroup) {
                          toggleReminder(reminder.id);
                        }
                      }}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300'
                          : inOtherGroup
                            ? 'bg-gray-50 border-gray-200 opacity-50'
                            : 'hover:bg-gray-50 border-gray-200 cursor-pointer'
                      }`}
                    >
                      <div className="mt-0.5">
                        <Checkbox
                          checked={isSelected}
                          disabled={inOtherGroup}
                          className="pointer-events-none"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">
                            {reminder.icon}
                          </span>
                          <span className="flex-1 truncate">
                            {reminder.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getPriorityColor(reminder.priority)}`}
                          >
                            {getPriorityLabel(reminder.priority)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {reminder.checklist.length}개 항목
                          </span>
                          {inOtherGroup && (
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              다른 그룹
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              💡 리마인더를 클릭하여 그룹에 추가/제거하세요. 다른 그룹에 속한
              리마인더는 선택할 수 없습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

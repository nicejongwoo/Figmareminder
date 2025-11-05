import { useState, useEffect } from 'react';
import { ReminderGroup, Reminder } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: ReminderGroup | null;
  reminders: Reminder[];
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

export function EditGroupDialog({
  open,
  onOpenChange,
  group,
  reminders,
  onSave,
}: EditGroupDialogProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📋');
  const [selectedReminderIds, setSelectedReminderIds] = useState<string[]>([]);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setIcon(group.icon);
      setSelectedReminderIds(group.reminderIds);
    } else {
      setName('');
      setIcon('📋');
      setSelectedReminderIds([]);
    }
  }, [group, open]);

  const handleSave = () => {
    if (!group || !name.trim()) return;

    onSave(group.id, {
      name: name.trim(),
      icon,
      reminderIds: selectedReminderIds,
    });

    onOpenChange(false);
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

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>그룹 편집</DialogTitle>
          <DialogDescription>
            그룹 정보를 수정하고 리마인더를 관리하세요
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="group-name">그룹 이름</Label>
              <Input
                id="group-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 외출 전, PC방 방문"
                disabled={group.isPreset}
              />
              {group.isPreset && (
                <p className="text-xs text-gray-500">
                  프리셋 그룹의 이름은 변경할 수 없습니다
                </p>
              )}
            </div>

            {/* Icon Selection */}
            <div className="space-y-2">
              <Label>아이콘 선택</Label>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{icon}</div>
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
            </div>

            {/* Reminders Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>그룹 리마인더 ({selectedReminderIds.length})</Label>
                {selectedReminderIds.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedReminderIds([]);
                    }}
                    className="h-8 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    모두 제거
                  </Button>
                )}
              </div>

              <div className="border rounded-lg">
                <div className="max-h-[300px] overflow-y-auto p-4">
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
                                ? 'bg-blue-50 border-blue-200'
                                : inOtherGroup
                                  ? 'bg-gray-50 border-gray-200 opacity-50'
                                  : 'hover:bg-gray-50 border-gray-200 cursor-pointer'
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              disabled={inOtherGroup}
                              className="mt-1 pointer-events-none"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">
                                  {reminder.icon}
                                </span>
                                <span className="flex-1">
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
                </div>
              </div>

              <p className="text-xs text-gray-500">
                💡 리마인더를 클릭하여 그룹에 추가/제거하세요. 다른 그룹에 속한
                리마인더는 선택할 수 없습니다.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

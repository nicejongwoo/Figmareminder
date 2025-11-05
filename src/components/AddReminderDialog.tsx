import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Plus, X, MapPin, Clock, Map } from 'lucide-react';
import { Reminder, ReminderPriority, ReminderTrigger, ChecklistItem, ReminderGroup } from '../types';

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'completionCount' | 'totalShown'>) => void;
  editingReminder?: Reminder | null;
  groups?: ReminderGroup[];
}

const EMOJI_OPTIONS = ['📸', '🏠', '💼', '🎮', '💊', '🏃', '🚗', '✈️', '🍔', '📚', '🎵', '🛒'];
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function AddReminderDialog({ open, onOpenChange, onSave, editingReminder, groups = [] }: AddReminderDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📌');
  const [priority, setPriority] = useState<ReminderPriority>('routine');
  const [trigger, setTrigger] = useState<ReminderTrigger>('time');
  const [time, setTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [locationName, setLocationName] = useState('');
  const [locationTrigger, setLocationTrigger] = useState<'arrive' | 'leave'>('leave');
  const [locationRadius, setLocationRadius] = useState(500);
  const [selectedGroup, setSelectedGroup] = useState<string>('none');
  const [checklist, setChecklist] = useState<Omit<ChecklistItem, 'id'>[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Load editing reminder data
  useEffect(() => {
    if (editingReminder) {
      setTitle(editingReminder.title);
      setDescription(editingReminder.description || '');
      setIcon(editingReminder.icon);
      setPriority(editingReminder.priority);
      setTrigger(editingReminder.trigger);
      setTime(editingReminder.time || '09:00');
      setSelectedDays(editingReminder.days || []);
      setLocationName(editingReminder.location?.name || '');
      setLocationTrigger(editingReminder.location?.triggerType || 'leave');
      setLocationRadius(editingReminder.location?.radius || 500);
      setSelectedGroup(editingReminder.groupId || 'none');
      setChecklist(editingReminder.checklist.map(item => ({ text: item.text, completed: item.completed })));
    } else {
      handleReset();
    }
  }, [editingReminder, open]);

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([...checklist, { text: newChecklistItem.trim(), completed: false }]);
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const reminder: Omit<Reminder, 'id' | 'createdAt' | 'completionCount' | 'totalShown'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      icon,
      priority,
      trigger,
      time: trigger === 'time' || trigger === 'both' ? time : undefined,
      days: selectedDays.length > 0 ? selectedDays : undefined,
      location: trigger === 'location' || trigger === 'both' 
        ? { name: locationName, triggerType: locationTrigger, radius: locationRadius }
        : undefined,
      groupId: selectedGroup !== 'none' ? selectedGroup : undefined,
      checklist: checklist.map((item, index) => ({
        id: editingReminder?.checklist[index]?.id || `temp-${Date.now()}-${index}`,
        ...item,
      })),
    };

    onSave(reminder);
    if (!editingReminder) {
      handleReset();
    }
    onOpenChange(false);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setIcon('📌');
    setPriority('routine');
    setTrigger('time');
    setTime('09:00');
    setSelectedDays([]);
    setLocationName('');
    setLocationTrigger('leave');
    setLocationRadius(500);
    setSelectedGroup('none');
    setChecklist([]);
    setNewChecklistItem('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{editingReminder ? '리마인더 수정' : '새 리마인더 만들기'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Icon Selection */}
          <div className="space-y-2">
            <Label>아이콘</Label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-2xl p-2 rounded border-2 transition-colors ${
                    icon === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 외출 전 확인"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="리마인더에 대한 추가 설명"
              rows={2}
            />
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label>우선순위</Label>
            <RadioGroup value={priority} onValueChange={(v) => setPriority(v as ReminderPriority)}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="routine" id="priority-low" />
                <Label htmlFor="priority-low" className="flex-1 cursor-pointer">
                  🟢 낮음 (루틴)
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="week" id="priority-medium" />
                <Label htmlFor="priority-medium" className="flex-1 cursor-pointer">
                  🟡 중간 (이번 주)
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="urgent" id="priority-high" />
                <Label htmlFor="priority-high" className="flex-1 cursor-pointer">
                  🔴 높음 (긴급)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Trigger Type */}
          <div className="space-y-3">
            <Label>알림 타입</Label>
            <RadioGroup value={trigger} onValueChange={(v) => setTrigger(v as ReminderTrigger)}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="time" id="trigger-time" />
                <Label htmlFor="trigger-time" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  시간 기반
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="location" id="trigger-location" />
                <Label htmlFor="trigger-location" className="flex-1 cursor-pointer flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  위치 기반
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="both" id="trigger-both" />
                <Label htmlFor="trigger-both" className="flex-1 cursor-pointer flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <MapPin className="h-4 w-4" />
                  둘 다
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Time Settings */}
          {(trigger === 'time' || trigger === 'both') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="time">시간</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>반복 요일</Label>
                <div className="flex gap-2">
                  {DAYS.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleDay(index)}
                      className={`flex-1 py-2 rounded border-2 transition-colors ${
                        selectedDays.includes(index)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {selectedDays.length === 0 && (
                  <p className="text-xs text-gray-500">요일을 선택하지 않으면 매일 알림됩니다</p>
                )}
              </div>
            </>
          )}

          {/* Location Settings */}
          {(trigger === 'location' || trigger === 'both') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="location">장소 이름</Label>
                <div className="flex gap-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-2" />
                  <Input
                    id="location"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="예: 우리집, PC방"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>알림 시점</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={locationTrigger === 'arrive' ? 'default' : 'outline'}
                    onClick={() => setLocationTrigger('arrive')}
                    className="flex-1"
                  >
                    도착 시
                  </Button>
                  <Button
                    type="button"
                    variant={locationTrigger === 'leave' ? 'default' : 'outline'}
                    onClick={() => setLocationTrigger('leave')}
                    className="flex-1"
                  >
                    떠날 때
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location-radius">반경</Label>
                  <span className="text-sm">{locationRadius}m</span>
                </div>
                <Slider
                  id="location-radius"
                  min={50}
                  max={2000}
                  step={50}
                  value={[locationRadius]}
                  onValueChange={(value) => setLocationRadius(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>50m</span>
                  <span>2000m</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => {}}
              >
                <Map className="h-4 w-4" />
                지도에서 위치 선택 (구현 예정)
              </Button>
            </>
          )}

          {/* Checklist */}
          <div className="space-y-2">
            <Label>체크리스트 항목</Label>
            <div className="space-y-2">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50">
                  <span className="text-gray-400">☐</span>
                  <Input
                    value={item.text}
                    onChange={(e) => {
                      const newChecklist = [...checklist];
                      newChecklist[index] = { ...item, text: e.target.value };
                      setChecklist(newChecklist);
                    }}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveChecklistItem(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="새 항목 입력"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
              />
              <Button type="button" onClick={handleAddChecklistItem} size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Group Selection */}
          {groups.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="group">그룹 (선택)</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger id="group">
                  <SelectValue placeholder="그룹 선택 안 함" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">그룹 없음</SelectItem>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.icon} {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

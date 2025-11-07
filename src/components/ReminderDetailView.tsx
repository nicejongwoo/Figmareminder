import { Reminder } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Repeat, 
  Edit, 
  Trash2, 
  Share2,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface ReminderDetailViewProps {
  reminder: Reminder;
  onBack: () => void;
  onToggleChecklistItem: (itemId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export function ReminderDetailView({
  reminder,
  onBack,
  onToggleChecklistItem,
  onEdit,
  onDelete,
  onShare,
}: ReminderDetailViewProps) {
  const completedCount = reminder.checklist.filter(item => item.completed).length;
  const totalCount = reminder.checklist.length;
  const completionRate = reminder.totalShown > 0 
    ? Math.round((reminder.completionCount / reminder.totalShown) * 100) 
    : 0;

  const priorityStars = {
    urgent: '★★★★★',
    week: '★★★',
    routine: '★',
  };

  const priorityLabels = {
    urgent: '🔴 긴급',
    week: '🟡 이번 주',
    routine: '🟢 루틴',
  };

  const getDaysText = (days?: number[]): string => {
    if (!days || days.length === 0) return '매일';
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    if (days.length === 7) return '매일';
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return '평일';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return '주말';
    return days.map(d => dayNames[d]).join(', ');
  };

  const getNextReminderText = () => {
    if (reminder.trigger === 'location' && reminder.location) {
      return `${reminder.location.name} ${reminder.location.triggerType === 'leave' ? '떠날 때' : '도착 시'}`;
    }
    if (reminder.time) {
      return `${getDaysText(reminder.days)} ${reminder.time}`;
    }
    return '설정 안 됨';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 active:scale-95 transition-transform">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <span className="text-3xl">{reminder.icon}</span>
        <h1 className="flex-1">{reminder.title}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Status Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">상태</span>
                <Badge 
                  variant={reminder.priority === 'urgent' ? 'destructive' : 'secondary'}
                  className="text-sm"
                >
                  {priorityLabels[reminder.priority]}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">우선순위</span>
                <span className="text-yellow-500 text-xl">{priorityStars[reminder.priority]}</span>
              </div>

              {reminder.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-gray-600 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      설명
                    </h3>
                    <p className="text-gray-700">{reminder.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">다음 알림</p>
                  <p className="text-gray-900">{getNextReminderText()}</p>
                </div>
              </div>

              {reminder.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">위치</p>
                    <p className="text-gray-900">
                      {reminder.location.name}
                      <span className="text-sm text-gray-500 ml-2">
                        ({reminder.location.triggerType === 'leave' ? '떠날 때' : '도착 시'})
                      </span>
                    </p>
                    {reminder.location.radius && (
                      <p className="text-xs text-gray-500 mt-1">
                        감지 반경: {reminder.location.radius}m
                      </p>
                    )}
                    {reminder.location.latitude && reminder.location.longitude && (
                      <p className="text-xs text-gray-400 mt-1">
                        위도: {reminder.location.latitude.toFixed(6)}, 경도: {reminder.location.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Repeat className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">반복</p>
                  <p className="text-gray-900">{getDaysText(reminder.days)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  ✓ 체크리스트
                </CardTitle>
                <Badge variant="outline">
                  {completedCount}/{totalCount} 완료
                </Badge>
              </div>
              <Progress value={(completedCount / totalCount) * 100} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              {reminder.checklist.map(item => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={`detail-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => onToggleChecklistItem(item.id)}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={`detail-${item.id}`}
                    className={`flex-1 cursor-pointer select-none ${
                      item.completed ? 'line-through text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {item.text}
                  </label>
                  {item.completed && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 통계
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">완료율</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{completionRate}%</span>
                  {completionRate >= 80 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : completionRate >= 50 ? (
                    <Badge variant="secondary">양호</Badge>
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-gray-600">완료 횟수</span>
                <span className="text-xl">{reminder.completionCount}회</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">알림 횟수</span>
                <span className="text-xl">{reminder.totalShown}회</span>
              </div>

              {reminder.lastCompleted && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">마지막 완료</p>
                    <p className="text-gray-900">
                      {new Date(reminder.lastCompleted).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <p className="text-sm text-gray-600 mb-1">생성일</p>
                <p className="text-gray-900">
                  {new Date(reminder.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Motivational Message */}
          {completionRate >= 80 && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="mb-1">훌륭해요!</p>
                <p className="text-sm text-gray-600">
                  높은 완료율을 유지하고 있습니다. 계속 이어가세요!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <div className="max-w-md mx-auto flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 gap-2 active:scale-95 transition-transform"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
            수정
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1 gap-2 text-red-600 hover:text-red-700 active:scale-95 transition-transform">
                <Trash2 className="h-4 w-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>리마인더를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 되돌릴 수 없습니다. 리마인더와 모든 체크리스트 항목이 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="active:scale-95 transition-transform">취소</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 active:scale-95 transition-transform">
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            variant="outline" 
            className="flex-1 gap-2 active:scale-95 transition-transform"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            공유
          </Button>
        </div>
      </div>
    </div>
  );
}

import { ReminderGroup, Reminder } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronRight, Lock, Edit } from 'lucide-react';

interface GroupsViewProps {
  groups: ReminderGroup[];
  reminders: Reminder[];
  onGroupClick: (groupId: string) => void;
  onEditGroup?: (group: ReminderGroup) => void;
}

export function GroupsView({ groups, reminders, onGroupClick, onEditGroup }: GroupsViewProps) {
  const presetGroups = groups.filter(g => g.isPreset);
  const customGroups = groups.filter(g => !g.isPreset);

  const getGroupReminderCount = (group: ReminderGroup) => {
    return group.reminderIds.length;
  };

  const getGroupCompletionRate = (group: ReminderGroup) => {
    const groupReminders = reminders.filter(r => group.reminderIds.includes(r.id));
    if (groupReminders.length === 0) return 0;
    
    const totalShown = groupReminders.reduce((sum, r) => sum + r.totalShown, 0);
    const totalCompleted = groupReminders.reduce((sum, r) => sum + r.completionCount, 0);
    
    return totalShown > 0 ? Math.round((totalCompleted / totalShown) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Preset Groups */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-gray-600">
          <span>📋</span>
          프리셋 그룹
        </h2>
        <div className="space-y-3">
          {presetGroups.map(group => {
            const reminderCount = getGroupReminderCount(group);
            const completionRate = getGroupCompletionRate(group);
            
            return (
              <Card
                key={group.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-3 flex-1"
                      onClick={() => onGroupClick(group.id)}
                    >
                      <span className="text-3xl">{group.icon}</span>
                      <div className="flex-1">
                        <h3 className="mb-1">{group.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {reminderCount} 리마인더
                          </Badge>
                          {reminderCount > 0 && (
                            <Badge 
                              variant={completionRate >= 80 ? 'default' : 'outline'} 
                              className="text-xs"
                            >
                              {completionRate}% 완료
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {onEditGroup && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditGroup(group);
                          }}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Custom Groups */}
      {customGroups.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-gray-600">
            <span>⚙️</span>
            커스텀 그룹
          </h2>
          <div className="space-y-3">
            {customGroups.map(group => {
              const reminderCount = getGroupReminderCount(group);
              const completionRate = getGroupCompletionRate(group);
              
              return (
                <Card
                  key={group.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-3 flex-1"
                        onClick={() => onGroupClick(group.id)}
                      >
                        <span className="text-3xl">{group.icon}</span>
                        <div className="flex-1">
                          <h3 className="mb-1">{group.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {reminderCount} 리마인더
                            </Badge>
                            {reminderCount > 0 && (
                              <Badge 
                                variant={completionRate >= 80 ? 'default' : 'outline'} 
                                className="text-xs"
                              >
                                {completionRate}% 완료
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {onEditGroup && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditGroup(group);
                            }}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                        )}
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="mb-2 flex items-center gap-2">
            💡 그룹이란?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            비슷한 상황의 리마인더들을 묶어서 관리할 수 있습니다. 
            예를 들어 "외출 전" 그룹에는 가스밸브, 창문, 불 확인 등을 포함할 수 있습니다.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            새 그룹 만들기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

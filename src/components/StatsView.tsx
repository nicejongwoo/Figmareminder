import { UserStats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, Award, Target, Flame } from 'lucide-react';

interface StatsViewProps {
  stats: UserStats;
}

export function StatsView({ stats }: StatsViewProps) {
  const unlockedBadges = stats.badges.filter(b => b.unlockedAt);
  const lockedBadges = stats.badges.filter(b => !b.unlockedAt);

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-600">현재 스트릭</span>
            </div>
            <div className="text-3xl mb-1">{stats.currentStreak}</div>
            <p className="text-xs text-gray-500">일 연속</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">주간 완료율</span>
            </div>
            <div className="text-3xl mb-1">{stats.weeklyCompletionRate}%</div>
            <Progress value={stats.weeklyCompletionRate} className="h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">최장 스트릭</span>
            </div>
            <div className="text-3xl mb-1">{stats.longestStreak}</div>
            <p className="text-xs text-gray-500">일</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-600">총 완료</span>
            </div>
            <div className="text-3xl mb-1">{stats.totalCompletions}</div>
            <p className="text-xs text-gray-500">개</p>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              획득한 배지 ({unlockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {unlockedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50"
                >
                  <div className="text-3xl mb-2 text-center">{badge.icon}</div>
                  <h4 className="text-center mb-1">{badge.name}</h4>
                  <p className="text-xs text-center text-gray-600">{badge.description}</p>
                  {badge.unlockedAt && (
                    <p className="text-xs text-center text-gray-400 mt-1">
                      {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔒 잠금 해제 대기 중 ({lockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {lockedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
                >
                  <div className="text-3xl mb-2 text-center filter grayscale">
                    {badge.icon}
                  </div>
                  <h4 className="text-center mb-1">{badge.name}</h4>
                  <p className="text-xs text-center text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivation Message */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardContent className="pt-6 text-center">
          {stats.currentStreak >= 7 ? (
            <>
              <p className="text-xl mb-2">🎉 대단해요!</p>
              <p className="text-sm opacity-90">
                {stats.currentStreak}일 연속 완료 중입니다. 계속 이어가세요!
              </p>
            </>
          ) : stats.weeklyCompletionRate >= 80 ? (
            <>
              <p className="text-xl mb-2">👏 잘하고 있어요!</p>
              <p className="text-sm opacity-90">
                이번 주 완료율 {stats.weeklyCompletionRate}%! 조금만 더 힘내세요!
              </p>
            </>
          ) : (
            <>
              <p className="text-xl mb-2">💪 시작이 반입니다!</p>
              <p className="text-sm opacity-90">
                오늘도 리마인더를 완료하고 스트릭을 쌓아보세요!
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

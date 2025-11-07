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
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-5 w-5 text-orange-600" />
              <span className="text-description text-gray-700">현재 스트릭</span>
            </div>
            <div className="text-title text-gray-900 mb-1">{stats.currentStreak}</div>
            <p className="text-description text-gray-600">일 연속</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-description text-gray-700">주간 완료율</span>
            </div>
            <div className="text-title text-gray-900 mb-2">{stats.weeklyCompletionRate}%</div>
            <Progress value={stats.weeklyCompletionRate} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-description text-gray-700">최장 스트릭</span>
            </div>
            <div className="text-title text-gray-900 mb-1">{stats.longestStreak}</div>
            <p className="text-description text-gray-600">일</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-description text-gray-700">총 완료</span>
            </div>
            <div className="text-title text-gray-900 mb-1">{stats.totalCompletions}</div>
            <p className="text-description text-gray-600">개</p>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-title flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              획득한 배지 ({unlockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {unlockedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="p-5 rounded-xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-sm"
                >
                  <div className="text-4xl mb-3 text-center">{badge.icon}</div>
                  <h4 className="text-content text-center mb-2 text-gray-900">{badge.name}</h4>
                  <p className="text-description text-center text-gray-700">{badge.description}</p>
                  {badge.unlockedAt && (
                    <p className="text-description text-center text-gray-500 mt-2">
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
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-title flex items-center gap-2">
              🔒 잠금 해제 대기 중 ({lockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {lockedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="p-5 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60 shadow-sm"
                >
                  <div className="text-4xl mb-3 text-center filter grayscale">
                    {badge.icon}
                  </div>
                  <h4 className="text-content text-center mb-2 text-gray-900">{badge.name}</h4>
                  <p className="text-description text-center text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivation Message */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-md">
        <CardContent className="pt-8 pb-8 text-center">
          {stats.currentStreak >= 7 ? (
            <>
              <p className="text-[22px] font-semibold mb-3 text-white">🎉 대단해요!</p>
              <p className="text-[16px] font-medium text-white">
                {stats.currentStreak}일 연속 완료 중입니다. 계속 이어가세요!
              </p>
            </>
          ) : stats.weeklyCompletionRate >= 80 ? (
            <>
              <p className="text-[22px] font-semibold mb-3 text-white">👏 잘하고 있어요!</p>
              <p className="text-[16px] font-medium text-white">
                이번 주 완료율 {stats.weeklyCompletionRate}%! 조금만 더 힘내세요!
              </p>
            </>
          ) : (
            <>
              <p className="text-[22px] font-semibold mb-3 text-white">💪 시작이 반입니다!</p>
              <p className="text-[16px] font-medium text-white">
                오늘도 리마인더를 완료하고 스트릭을 쌓아보세요!
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

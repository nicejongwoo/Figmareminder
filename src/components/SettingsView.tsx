import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, Bell, MapPin, Database, Info, Trash2, Download, AlertTriangle, Volume2, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface SettingsViewProps {
  onBack: () => void;
  onClearAllData: () => void;
  onExportData: () => void;
}

export function SettingsView({
  onBack,
  onClearAllData,
  onExportData,
}: SettingsViewProps) {
  // Notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Location settings
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [backgroundTracking, setBackgroundTracking] = useState(false);

  // Other settings
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const handleClearData = () => {
    onClearAllData();
    toast.success('🗑️ 모든 데이터가 삭제되었습니다');
  };

  const handleExportData = () => {
    onExportData();
    toast.success('📥 데이터를 내보냈습니다');
  };

  const handleNotificationTest = () => {
    if (notificationsEnabled) {
      toast.info('🔔 테스트 알림', {
        description: '알림이 정상적으로 작동합니다!',
      });
    } else {
      toast.error('알림이 비활성화되어 있습니다');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h2 className="text-lg">설정</h2>
            <p className="text-sm text-gray-500">앱 설정 및 환경 설정</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle>알림 설정</CardTitle>
            </div>
            <CardDescription>리마인더 알림 방식을 설정합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">알림 활성화</Label>
                <p className="text-sm text-gray-500">
                  리마인더 알림을 받습니다
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="sound">알림 소리</Label>
                  <p className="text-sm text-gray-500">알림 시 소리를 재생합니다</p>
                </div>
              </div>
              <Switch
                id="sound"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                disabled={!notificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="vibration">진동</Label>
                  <p className="text-sm text-gray-500">알림 시 진동을 울립니다</p>
                </div>
              </div>
              <Switch
                id="vibration"
                checked={vibrationEnabled}
                onCheckedChange={setVibrationEnabled}
                disabled={!notificationsEnabled}
              />
            </div>

            <Separator />

            <Button
              variant="outline"
              onClick={handleNotificationTest}
              className="w-full active:scale-95 transition-transform"
            >
              <Bell className="h-4 w-4 mr-2" />
              알림 테스트
            </Button>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <CardTitle>위치 추적 설정</CardTitle>
            </div>
            <CardDescription>위치 기반 리마인더를 위한 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location-tracking">위치 추적</Label>
                <p className="text-sm text-gray-500">
                  위치 기반 리마인더를 활성화합니다
                </p>
              </div>
              <Switch
                id="location-tracking"
                checked={locationTrackingEnabled}
                onCheckedChange={setLocationTrackingEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-accuracy">높은 정확도</Label>
                <p className="text-sm text-gray-500">
                  GPS를 사용하여 정확한 위치를 추적합니다
                </p>
              </div>
              <Switch
                id="high-accuracy"
                checked={highAccuracy}
                onCheckedChange={setHighAccuracy}
                disabled={!locationTrackingEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="background-tracking">백그라운드 추적</Label>
                <p className="text-sm text-gray-500">
                  앱이 백그라운드에 있어도 위치를 추적합니다
                </p>
              </div>
              <Switch
                id="background-tracking"
                checked={backgroundTracking}
                onCheckedChange={setBackgroundTracking}
                disabled={!locationTrackingEnabled}
              />
            </div>

            {locationTrackingEnabled && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-900">
                  💡 <strong>참고:</strong> 위치 추적은 배터리를 더 많이 소모할 수 있습니다. 
                  높은 정확도는 더 정확하지만 배터리 소모가 큽니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <CardTitle>데이터 관리</CardTitle>
            </div>
            <CardDescription>앱 데이터를 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">자동 저장</Label>
                <p className="text-sm text-gray-500">
                  변경사항을 자동으로 저장합니다
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSaveEnabled}
                onCheckedChange={setAutoSaveEnabled}
              />
            </div>

            <Separator />

            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start gap-2 active:scale-95 transition-transform"
            >
              <Download className="h-4 w-4" />
              데이터 내보내기
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 active:scale-95 transition-transform"
                >
                  <Trash2 className="h-4 w-4" />
                  모든 데이터 삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    모든 데이터를 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 모든 리마인더, 그룹, 통계 데이터가
                    영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="active:scale-95 transition-transform">
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearData}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 transition-transform"
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-900">
                ⚠️ <strong>주의:</strong> 데이터를 삭제하기 전에 반드시 내보내기를 통해 
                백업하는 것을 권장합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle>앱 정보</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">버전</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">개발자</span>
              <span className="text-sm font-medium">Smart Reminder Team</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">마지막 업데이트</span>
              <span className="text-sm font-medium">2025.11.07</span>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-gray-700">
                📱 <strong>상황 기반 지능형 리마인더</strong>
                <br />
                위치, 상황, 행동 패턴에 기반한 스마트 알림 서비스
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}

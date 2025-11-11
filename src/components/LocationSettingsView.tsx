import { useState } from 'react';
import { SavedLocation } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin, Plus, Edit, Trash2, Locate, Loader2, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';

interface LocationSettingsViewProps {
  savedLocations: SavedLocation[];
  onAddLocation: (location: Omit<SavedLocation, 'id' | 'createdAt'>) => void;
  onUpdateLocation: (id: string, location: Omit<SavedLocation, 'id' | 'createdAt'>) => void;
  onDeleteLocation: (id: string) => void;
  onBack: () => void;
}

const LOCATION_ICONS = ['🏠', '💼', '🎮', '🏋️', '🛒', '💊', '☕', '📚', '🏫', '🏥', '🏦', '🍔'];

export function LocationSettingsView({
  savedLocations,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
  onBack,
}: LocationSettingsViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<SavedLocation | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📍');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState(100);
  const [address, setAddress] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleOpenDialog = (location?: SavedLocation) => {
    if (location) {
      setEditingLocation(location);
      setName(location.name);
      setIcon(location.icon);
      setLatitude(location.latitude.toString());
      setLongitude(location.longitude.toString());
      setRadius(location.radius);
      setAddress(location.address || '');
    } else {
      setEditingLocation(null);
      setName('');
      setIcon('📍');
      setLatitude('');
      setLongitude('');
      setRadius(100);
      setAddress('');
    }
    setDialogOpen(true);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('이 브라우저는 위치 서비스를 지원하지 않습니다');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setIsGettingLocation(false);
        toast.success('✅ 현재 위치를 가져왔습니다');
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = '위치를 가져올 수 없습니다';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = '위치 정보를 사용할 수 없습니다';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = '위치 요청 시간이 초과되었습니다';
        }
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('위치 이름을 입력해주세요');
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      toast.error('유효한 좌표를 입력해주세요');
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      toast.error('좌표 범위가 올바르지 않습니다 (위도: -90~90, 경도: -180~180)');
      return;
    }

    const locationData = {
      name: name.trim(),
      icon,
      latitude: lat,
      longitude: lon,
      radius,
      address: address.trim() || undefined,
    };

    if (editingLocation) {
      onUpdateLocation(editingLocation.id, locationData);
      toast.success('✅ 위치가 수정되었습니다');
    } else {
      onAddLocation(locationData);
      toast.success('✅ 위치가 추가되었습니다');
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}" 위치를 삭제하시겠습니까?`)) {
      onDeleteLocation(id);
      toast.success('🗑️ 위치가 삭제되었습니다');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="active:scale-95 transition-transform">
            <X className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg">저장된 위치 관리</h2>
            <p className="text-sm text-gray-500">자주 사용하는 위치를 저장하세요</p>
          </div>
          <Button onClick={() => handleOpenDialog()} size="sm" className="gap-2 active:scale-95 transition-transform">
            <Plus className="h-4 w-4" />
            추가
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {savedLocations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">저장된 위치가 없습니다</p>
            <p className="text-sm text-gray-400 mb-6">
              자주 가는 장소를 저장하면 빠르게 위치 기반 리마인더를 만들 수 있습니다
            </p>
            <Button onClick={() => handleOpenDialog()} className="gap-2 active:scale-95 transition-transform">
              <Plus className="h-4 w-4" />
              첫 위치 추가하기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedLocations.map((location) => (
              <Card key={location.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{location.icon}</div>
                      <div>
                        <CardTitle className="text-base">{location.name}</CardTitle>
                        {location.address && (
                          <CardDescription className="text-xs mt-1">
                            {location.address}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 active:scale-95 transition-transform"
                        onClick={() => handleOpenDialog(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 active:scale-95 transition-transform"
                        onClick={() => handleDelete(location.id, location.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      반경 {location.radius}m
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? '위치 수정' : '새 위치 추가'}
            </DialogTitle>
            <DialogDescription>
              GPS로 현재 위치를 가져오거나 직접 좌표를 입력하세요
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {/* Icon Selection */}
            <div className="space-y-2">
              <Label>아이콘</Label>
              <div className="flex flex-wrap gap-2">
                {LOCATION_ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`text-2xl p-2 rounded border-2 transition-all active:scale-95 ${
                      icon === emoji
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="location-name">위치 이름 *</Label>
              <Input
                id="location-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 우리 집, 회사, 단골 PC방"
              />
            </div>

            {/* Address (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="address">주소 (선택)</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="예: 서울시 강남구 ..."
              />
            </div>

            {/* Get Current Location Button */}
            <div className="space-y-2">
              <Label>위치 좌표</Label>
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-full active:scale-95 transition-transform"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    위치 가져오는 중...
                  </>
                ) : (
                  <>
                    <Locate className="h-4 w-4 mr-2" />
                    🎯 GPS로 현재 위치 가져오기
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500">
                💡 GPS를 사용하여 현재 위치의 정확한 좌표를 자동으로 입력합니다
              </p>
            </div>

            {/* Coordinates Input */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">좌표 직접 입력</Label>
                {latitude && longitude && (
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    입력됨
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-xs">위도 (Latitude) *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="37.5665"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">-90 ~ 90</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-xs">경도 (Longitude) *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="126.9780"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">-180 ~ 180</p>
                </div>
              </div>

              {latitude && longitude && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <p className="text-xs text-blue-900">
                    ✅ <strong>현재 좌표:</strong> {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* Radius */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="radius" className="text-base">🎯 감지 반경</Label>
                <Badge variant="secondary" className="text-sm">
                  {radius}m
                </Badge>
              </div>
              <input
                type="range"
                id="radius"
                min="50"
                max="1000"
                step="50"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>최소 50m</span>
                <span>최대 1000m</span>
              </div>
              <p className="text-xs text-gray-600">
                💡 이 반경 안에 들어오면 알림이 울립니다
              </p>
            </div>

            {/* Help Text */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-900">
                <strong>💡 사용 팁:</strong>
              </p>
              <ul className="text-xs text-yellow-800 mt-2 space-y-1 ml-4 list-disc">
                <li>GPS 버튼을 누르면 현재 위치를 자동으로 가져옵니다</li>
                <li>좌표를 직접 입력할 수도 있습니다 (Google Maps 등에서 확인 가능)</li>
                <li>감지 반경은 50m~1000m 사이로 설정할 수 있습니다</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="active:scale-95 transition-transform">
              취소
            </Button>
            <Button onClick={handleSave} className="active:scale-95 transition-transform">저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

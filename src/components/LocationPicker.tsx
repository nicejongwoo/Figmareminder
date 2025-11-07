import { useState, useEffect } from 'react';
import { Location, SavedLocation } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { MapPin, Locate, Loader2, X, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LocationPickerProps {
  location: Location | undefined;
  onChange: (location: Location | undefined) => void;
  savedLocations?: SavedLocation[];
}

// Preset locations
const PRESET_LOCATIONS = [
  { name: 'PC방', icon: '🎮' },
  { name: '집', icon: '🏠' },
  { name: '회사', icon: '💼' },
  { name: '헬스장', icon: '🏋️' },
  { name: '마트', icon: '🛒' },
  { name: '약국', icon: '💊' },
  { name: '카페', icon: '☕' },
  { name: '학교', icon: '📚' },
];

export function LocationPicker({ location, onChange, savedLocations = [] }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      setShowAdvanced(true);
    }
  }, [location]);

  const selectSavedLocation = (savedLocation: SavedLocation) => {
    const newLocation: Location = {
      name: savedLocation.name,
      latitude: savedLocation.latitude,
      longitude: savedLocation.longitude,
      radius: savedLocation.radius,
      triggerType: location?.triggerType || 'arrive',
    };
    onChange(newLocation);
    setShowAdvanced(true);
    toast.success(`"${savedLocation.name}" 위치를 선택했습니다`);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('이 브라우저는 위치 서비스를 지원하지 않습니다');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: Location = {
          name: location?.name || '현재 위치',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: location?.radius || 100,
          triggerType: location?.triggerType || 'arrive',
        };
        onChange(newLocation);
        setIsGettingLocation(false);
        setShowAdvanced(true);
        toast.success('현재 위치를 가져왔습니다');
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = '위치를 가져올 수 없습니다';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = '위치 권한이 거부되었습니다';
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

  const selectPresetLocation = (presetName: string) => {
    const newLocation: Location = {
      name: presetName,
      latitude: location?.latitude,
      longitude: location?.longitude,
      radius: location?.radius || 100,
      triggerType: location?.triggerType || 'arrive',
    };
    onChange(newLocation);
  };

  const handleRemoveLocation = () => {
    onChange(undefined);
    setShowAdvanced(false);
  };

  return (
    <div className="space-y-4">
      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            저장된 위치
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {savedLocations.map((saved) => (
              <button
                key={saved.id}
                type="button"
                onClick={() => selectSavedLocation(saved)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  location?.latitude === saved.latitude &&
                  location?.longitude === saved.longitude
                    ? 'bg-blue-50 border-blue-300'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-xl">{saved.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{saved.name}</div>
                    <div className="text-xs text-gray-500">{saved.radius}m</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location Name */}
      <div className="space-y-2">
        <Label htmlFor="location-name">위치 이름</Label>
        <Input
          id="location-name"
          value={location?.name || ''}
          onChange={(e) =>
            onChange({
              name: e.target.value,
              latitude: location?.latitude,
              longitude: location?.longitude,
              radius: location?.radius || 100,
              triggerType: location?.triggerType || 'arrive',
            })
          }
          placeholder="예: PC방, 집, 회사"
        />
      </div>

      {/* Preset Locations */}
      <div className="space-y-2">
        <Label>빠른 선택</Label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_LOCATIONS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => selectPresetLocation(preset.name)}
              className={`p-2 rounded-lg border text-center transition-colors ${
                location?.name === preset.name
                  ? 'bg-blue-50 border-blue-300'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="text-xs">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Get Current Location */}
      <Button
        type="button"
        variant="outline"
        onClick={getCurrentLocation}
        disabled={isGettingLocation}
        className="w-full"
      >
        {isGettingLocation ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            위치 가져오는 중...
          </>
        ) : (
          <>
            <Locate className="h-4 w-4 mr-2" />
            현재 위치 사용
          </>
        )}
      </Button>

      {/* Advanced Settings */}
      {showAdvanced && location && (
        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <Label>상세 설정</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveLocation}
              className="h-8 text-xs text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3 mr-1" />
              위치 제거
            </Button>
          </div>

          {/* Coordinates (if available) */}
          {location.latitude && location.longitude && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MapPin className="h-4 w-4" />
                <span>좌표 정보</span>
              </div>
              <div className="text-xs text-gray-500">
                위도: {location.latitude.toFixed(6)}
                <br />
                경도: {location.longitude.toFixed(6)}
              </div>
            </div>
          )}

          {/* Radius */}
          <div className="space-y-2">
            <Label htmlFor="location-radius">
              감지 반경: {location.radius || 100}m
            </Label>
            <input
              type="range"
              id="location-radius"
              min="50"
              max="1000"
              step="50"
              value={location.radius || 100}
              onChange={(e) =>
                onChange({
                  ...location,
                  radius: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50m</span>
              <span>1000m</span>
            </div>
          </div>

          {/* Trigger Type */}
          <div className="space-y-2">
            <Label htmlFor="trigger-type">알림 조건</Label>
            <Select
              value={location.triggerType}
              onValueChange={(value: 'arrive' | 'leave') =>
                onChange({
                  ...location,
                  triggerType: value,
                })
              }
            >
              <SelectTrigger id="trigger-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arrive">
                  도착할 때 (위치에 진입)
                </SelectItem>
                <SelectItem value="leave">
                  떠날 때 (위치에서 벗어남)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {!showAdvanced && location?.name && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAdvanced(true)}
          className="w-full"
        >
          상세 설정
        </Button>
      )}
    </div>
  );
}

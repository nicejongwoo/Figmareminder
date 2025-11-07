import { useState, useEffect, useRef } from 'react';
import { SavedLocation } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin, Plus, Edit, Trash2, Locate, Loader2, X, Navigation } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
  const [selectedTab, setSelectedTab] = useState<'map' | 'manual'>('map');
  
  // Map related state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

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
    setSelectedTab('map');
    setDialogOpen(true);
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!dialogOpen || !mapContainerRef.current) return;

    // Dynamically import Leaflet
    const initMap = async () => {
      try {
        // Import Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Import Leaflet JS
        const L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
        
        // Clear existing map
        if (mapRef.current) {
          mapRef.current.remove();
        }

        // Default center (Seoul, Korea)
        const defaultLat = parseFloat(latitude) || 37.5665;
        const defaultLng = parseFloat(longitude) || 126.9780;

        // Create map
        const map = (L as any).map(mapContainerRef.current).setView([defaultLat, defaultLng], 15);

        // Add tile layer
        (L as any).tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Custom icon
        const customIcon = (L as any).divIcon({
          html: `<div style="font-size: 32px; text-align: center; line-height: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${icon}</div>`,
          className: 'custom-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        // Add marker if coordinates exist
        if (latitude && longitude) {
          const marker = (L as any).marker([defaultLat, defaultLng], { 
            icon: customIcon,
            draggable: true 
          }).addTo(map);

          // Add circle for radius
          const circle = (L as any).circle([defaultLat, defaultLng], {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            radius: radius,
          }).addTo(map);

          markerRef.current = marker;
          circleRef.current = circle;

          // Update coordinates when marker is dragged
          marker.on('dragend', () => {
            const pos = marker.getLatLng();
            setLatitude(pos.lat.toFixed(6));
            setLongitude(pos.lng.toFixed(6));
            circle.setLatLng(pos);
          });
        }

        // Add click handler to place marker
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          setLatitude(lat.toFixed(6));
          setLongitude(lng.toFixed(6));

          // Remove existing marker and circle
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          if (circleRef.current) {
            map.removeLayer(circleRef.current);
          }

          // Add new marker
          const marker = (L as any).marker([lat, lng], { 
            icon: customIcon,
            draggable: true 
          }).addTo(map);

          // Add circle
          const circle = (L as any).circle([lat, lng], {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            radius: radius,
          }).addTo(map);

          markerRef.current = marker;
          circleRef.current = circle;

          // Update coordinates when marker is dragged
          marker.on('dragend', () => {
            const pos = marker.getLatLng();
            setLatitude(pos.lat.toFixed(6));
            setLongitude(pos.lng.toFixed(6));
            circle.setLatLng(pos);
          });
        });

        mapRef.current = map;

        // Force resize
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

      } catch (error) {
        console.error('Failed to load map:', error);
        toast.error('지도를 불러올 수 없습니다');
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [dialogOpen, icon]);

  // Update circle radius when slider changes
  useEffect(() => {
    if (circleRef.current && mapRef.current) {
      circleRef.current.setRadius(radius);
    }
  }, [radius]);

  // Update marker position when coordinates change manually
  useEffect(() => {
    if (selectedTab !== 'manual') return;
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (!isNaN(lat) && !isNaN(lng) && mapRef.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        if (circleRef.current) {
          circleRef.current.setLatLng([lat, lng]);
        }
        mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      }
    }
  }, [latitude, longitude, selectedTab]);

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
        toast.success('현재 위치를 가져왔습니다');

        // Update map view and marker
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 15);

          // Remove existing marker and circle
          if (markerRef.current) {
            mapRef.current.removeLayer(markerRef.current);
          }
          if (circleRef.current) {
            mapRef.current.removeLayer(circleRef.current);
          }

          // Add new marker
          const L = (window as any).L;
          if (L) {
            const customIcon = L.divIcon({
              html: `<div style="font-size: 32px; text-align: center; line-height: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${icon}</div>`,
              className: 'custom-marker',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            });

            const marker = L.marker([lat, lng], { 
              icon: customIcon,
              draggable: true 
            }).addTo(mapRef.current);

            const circle = L.circle([lat, lng], {
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.15,
              radius: radius,
            }).addTo(mapRef.current);

            markerRef.current = marker;
            circleRef.current = circle;

            marker.on('dragend', () => {
              const pos = marker.getLatLng();
              setLatitude(pos.lat.toFixed(6));
              setLongitude(pos.lng.toFixed(6));
              circle.setLatLng(pos);
            });
          }
        }
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
      toast.error('좌표 범위가 올바르지 않습니다');
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? '위치 수정' : '새 위치 추가'}
            </DialogTitle>
            <DialogDescription>
              지도에서 위치를 선택하거나 직접 좌표를 입력하세요
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

            {/* Tabs for Map and Manual Input */}
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'map' | 'manual')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="map" className="gap-2">
                  <Navigation className="h-4 w-4" />
                  지도에서 선택
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  직접 입력
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-4 mt-4">
                {/* Get Current Location */}
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
                      현재 위치로 이동
                    </>
                  )}
                </Button>

                {/* Map Container */}
                <div className="space-y-2">
                  <Label>지도에서 위치 선택 (클릭하거나 마커를 드래그하세요)</Label>
                  <div 
                    ref={mapContainerRef} 
                    className="w-full h-[300px] rounded-lg border border-gray-300 bg-gray-100"
                  />
                  {latitude && longitude && (
                    <p className="text-xs text-gray-500 text-center">
                      선택된 좌표: {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4 mt-4">
                {/* Get Current Location */}
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
                      현재 위치 사용
                    </>
                  )}
                </Button>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">위도 *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="37.5665"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">경도 *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="126.9780"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900">
                    💡 <strong>팁:</strong> 좌표를 모르는 경우 \"현재 위치 사용\" 버튼을 눌러 현재 위치의 좌표를 자동으로 입력할 수 있습니다.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Radius */}
            <div className="space-y-2">
              <Label htmlFor="radius">감지 반경: {radius}m</Label>
              <input
                type="range"
                id="radius"
                min="50"
                max="1000"
                step="50"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>50m</span>
                <span>1000m</span>
              </div>
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

import { useState, useEffect, useRef } from 'react';
import { Reminder } from '../types';
import { isWithinRadius, watchPosition, clearWatch } from '../utils/geolocation';
import { toast } from 'sonner@2.0.3';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  isTracking: boolean;
  error: string | null;
}

export function useLocationTracking(
  reminders: Reminder[],
  onLocationTrigger: (reminder: Reminder) => void
) {
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    isTracking: false,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);
  const previousStatesRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    // Filter reminders with location triggers
    const locationReminders = reminders.filter(
      (r) =>
        (r.trigger === 'location' || r.trigger === 'both') &&
        r.location?.latitude &&
        r.location?.longitude
    );

    if (locationReminders.length === 0) {
      // No location-based reminders, stop tracking
      if (watchIdRef.current !== null) {
        clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setLocationState((prev) => ({ ...prev, isTracking: false }));
      }
      return;
    }

    // Start tracking
    setLocationState((prev) => ({ ...prev, isTracking: true, error: null }));

    try {
      watchIdRef.current = watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          setLocationState({
            latitude,
            longitude,
            accuracy,
            isTracking: true,
            error: null,
          });

          // Check each location-based reminder
          locationReminders.forEach((reminder) => {
            if (!reminder.location) return;

            const isInside = isWithinRadius(
              latitude,
              longitude,
              reminder.location
            );

            const wasInside = previousStatesRef.current.get(reminder.id) || false;

            // Trigger on state change
            let shouldTrigger = false;

            if (reminder.location.triggerType === 'arrive' && isInside && !wasInside) {
              shouldTrigger = true;
            } else if (reminder.location.triggerType === 'leave' && !isInside && wasInside) {
              shouldTrigger = true;
            }

            if (shouldTrigger) {
              onLocationTrigger(reminder);
            }

            // Update previous state
            previousStatesRef.current.set(reminder.id, isInside);
          });
        },
        (error) => {
          let errorMessage = '위치 추적 중 오류가 발생했습니다';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = '위치 권한이 거부되었습니다';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = '위치 정보를 사용할 수 없습니다';
          }
          
          setLocationState((prev) => ({
            ...prev,
            isTracking: false,
            error: errorMessage,
          }));
        }
      );
    } catch (error) {
      setLocationState((prev) => ({
        ...prev,
        isTracking: false,
        error: 'Geolocation API를 사용할 수 없습니다',
      }));
    }

    return () => {
      if (watchIdRef.current !== null) {
        clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [reminders, onLocationTrigger]);

  return locationState;
}

import { useState, useEffect, useCallback, useRef } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  heading: number | null;
  accuracy: number | null;
  error: string | null;
}

export function useGeolocation(enabled = false, interval = 3000) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    speed: null,
    heading: null,
    accuracy: null,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation not supported' }));
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          accuracy: position.coords.accuracy,
          error: null,
        });
      },
      (error) => {
        setState((prev) => ({ ...prev, error: error.message }));
      },
      {
        enableHighAccuracy: true,
        maximumAge: interval,
        timeout: 10000,
      }
    );
  }, [interval]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startTracking();
    } else {
      stopTracking();
    }
    return stopTracking;
  }, [enabled, startTracking, stopTracking]);

  return { ...state, startTracking, stopTracking };
}

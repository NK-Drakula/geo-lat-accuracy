import { useEffect, useRef, useState } from "react";

type PositionState = {
    latitude: number | null;
    longitude: number | null;
    accuracy?: number | null;
    timestamp?: number | null;
    error?: GeolocationPositionError | null;
    watching: boolean;
};

export function useGeolocationWatch(options?: PositionOptions) {
    const [state, setState] = useState<PositionState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        error: null,
        watching: false,
    });

    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        // If geolocation not supported
        if (!("geolocation" in navigator)) {
            setState(s => ({ ...s, error: { code: 0, message: "Geolocation not supported", PERMISSION_DENIED: 1 } as any }));
            return;
        }

        // Start watch
        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                setState({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    timestamp: pos.timestamp,
                    error: null,
                    watching: true,
                });
            },
            (err) => {
                setState(s => ({ ...s, error: err, watching: false }));
            },
            options ?? { enableHighAccuracy: false, maximumAge: 5000, timeout: 10000 }
        );

        // cleanup
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
        // If you want to restart on options change, include options in deps
    }, []); // empty -> start once on mount

    const stop = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
            setState(s => ({ ...s, watching: false }));
        }
    };

    return { state, stop };
}

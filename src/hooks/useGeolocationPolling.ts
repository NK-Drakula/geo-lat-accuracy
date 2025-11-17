import { useEffect, useRef, useState } from "react";

type PollState = {
    latitude: number | null;
    longitude: number | null;
    accuracy?: number | null;
    timestamp?: number | null;
    error?: GeolocationPositionError | null;
    running: boolean;
};

export function useGeolocationPolling(intervalMs = 15000, options?: PositionOptions) {
    const [state, setState] = useState<PollState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        error: null,
        running: false,
    });

    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setState(s => ({ ...s, error: { code: 0, message: "Geolocation not supported" } as any }));
            return;
        }

        const fetchOnce = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setState({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                        timestamp: pos.timestamp,
                        error: null,
                        running: true,
                    });
                },
                (err) => {
                    setState(s => ({ ...s, error: err }));
                },
                options ?? { enableHighAccuracy: false, maximumAge: 0, timeout: 10000 }
            );
        };

        // initial call
        fetchOnce();

        // set up interval
        intervalRef.current = window.setInterval(fetchOnce, intervalMs);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setState(s => ({ ...s, running: false }));
            }
        };
    }, [intervalMs, JSON.stringify(options ?? {})]); // be careful comparing options

    const stop = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setState(s => ({ ...s, running: false }));
        }
    };

    return { state, stop };
}

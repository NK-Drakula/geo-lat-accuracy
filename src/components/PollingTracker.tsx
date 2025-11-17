import React from "react";
import { useGeolocationPolling } from "../hooks/useGeolocationPolling";

export default function PollingTracker() {
    const { state, stop } = useGeolocationPolling(30000, { enableHighAccuracy: false });

    return (
        <div>
            <h3>Polling location (every 30s)</h3>
            {state.error && <p style={{ color: "red" }}>{state.error.message}</p>}
            <p>Lat: {state.latitude ?? "—"}</p>
            <p>Lng: {state.longitude ?? "—"}</p>
            <p>Running: {state.running ? "Yes" : "No"}</p>
            <button onClick={stop}>Stop polling</button>
        </div>
    );
}

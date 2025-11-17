import { useGeolocationWatch } from "../hooks/useGeolocationWatch";
// import { useGeolocationWatch } from "./useGeolocationWatch";

export default function Tracker() {
    const { state, stop } = useGeolocationWatch({ enableHighAccuracy: true });

    return (
        <div>
            <h3>Live location</h3>
            {state.error ? <p style={{ color: "red" }}>{state.error.message}</p> : null}
            <p>Latitude: {state.latitude ?? "—"}</p>
            <p>Longitude: {state.longitude ?? "—"}</p>
            <p>Accuracy: {state.accuracy ?? "—"} meters</p>
            <p>Watching: {state.watching ? "Yes" : "No"}</p>
            <button onClick={stop}>Stop watching</button>
        </div>
    );
}

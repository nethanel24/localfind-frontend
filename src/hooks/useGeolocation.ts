import { useState, useEffect } from "react";
import type { Coords } from "../types";

// Asks the browser for the user's position once, and reports when the answer arrives
export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coords | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setReady(true);
      },
      () => setReady(true)
    );
  }, []);

  return { coords, ready };
};
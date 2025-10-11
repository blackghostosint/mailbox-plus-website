import React, { useState, useEffect } from "react";
import { Button } from "./ui";

interface VisitUsButtonProps {
  defaultCity: string; // e.g., "Concord Township"
  className?: string;
}

export const VisitUsButton: React.FC<VisitUsButtonProps> = ({ defaultCity, className }) => {
  const [userCity, setUserCity] = useState(defaultCity);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const updateCity = async (latitude: number, longitude: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        const address = data.address;

        // Prefer city -> town -> village -> county/state
        const city =
          address?.city ||
          address?.town ||
          address?.village ||
          address?.county ||
          address?.state ||
          defaultCity;

        // If city is very small (like a village), prepend "near"
        const displayCity =
          address?.village || address?.town ? `near ${city}` : city;

        setUserCity(displayCity);
      } catch {
        setUserCity(defaultCity);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateCity(latitude, longitude);
      },
      () => {
        setUserCity(defaultCity); // fallback if permission denied
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [defaultCity]);

  return <Button className={className}>Visit Us from {userCity}</Button>;
};
import React, { createContext, useState, useContext, useEffect } from "react";
import * as Location from "expo-location";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [city, setCity] = useState("Detecting..."); // Default city
  const [stadiumLocation, setStadiumLocation] = useState("Wembley, London"); // Admin's stadium location
  const [role, setRole] = useState("fan"); // 'fan' or 'admin'

  const updateLocation = async () => {
    try {
      // 1. Request foreground permissions
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setCity("Location Denied");
        return;
      }

      // 2. Get current position (This triggers GPS turn-on prompt if not already on)
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 3. Reverse geocode to get city name
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const address = geocode[0];
        const cityName =
          address.city || address.district || address.region || "Unknown City";
        setCity(cityName);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setCity("Location Error");
    }
  };

  return (
    <UserContext.Provider
      value={{
        city,
        setCity,
        stadiumLocation,
        setStadiumLocation,
        role,
        setRole,
        updateLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

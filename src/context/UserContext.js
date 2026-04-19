/**
 * UserContext — provides city, stadium info, and role to the app.
 *
 * Removed: custom backend STOMP/WebSocket heatmap reporting (was tied to the
 * old REST server). Removed: API_CONFIG and stadiumService REST calls.
 *
 * Now uses: StadiumRepository (Firebase) for admin stadium lookup.
 * Location detection is preserved using expo-location.
 */
import React, { createContext, useState, useContext, useEffect } from "react";
import * as Location from "expo-location";
import { useAuth } from "./AuthContext";
import { StadiumRepository } from "../repositories/StadiumRepository";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [city, setCity] = useState("Detecting...");
  const [stadiumLocation, setStadiumLocation] = useState("Stadium Name");
  const [stadiumId, setStadiumId] = useState(null);
  const [role, setRole] = useState("fan");

  const { userInfo } = useAuth();

  /** Reverse-geocode the device's current position to get a city name. */
  const updateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setCity("Location Denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode) {
        setCity(geocode.city || geocode.district || geocode.region || "Unknown City");
      }
    } catch (error) {
      console.error("UserContext: Location error", error);
      setCity("Location Error");
    }
  };

  // Auto-detect location on mount
  useEffect(() => {
    updateLocation();
  }, []);

  // Sync role and fetch stadium info when the logged-in user changes
  useEffect(() => {
    if (!userInfo) {
      setRole("fan");
      setStadiumLocation("Stadium Name");
      setStadiumId(null);
      return;
    }

    const userRole =
      (userInfo.role || (userInfo.roles && userInfo.roles[0]) || "user").toLowerCase();
    setRole(userRole);

    // If the user is an admin, find the stadium they manage via Firestore
    const isAdmin =
      userRole === "admin" ||
      userInfo.roles?.some((r) =>
        typeof r === "string" && r.toLowerCase().includes("admin"),
      );

    if (isAdmin && userInfo.uid) {
      StadiumRepository.getByAdminUid(userInfo.uid)
        .then((stadium) => {
          if (stadium) {
            const loc =
              stadium.city && stadium.state
                ? `${stadium.name}, ${stadium.city}`
                : stadium.name || "Your Stadium";
            setStadiumLocation(loc);
            setStadiumId(stadium.id);
          }
        })
        .catch((err) => console.error("UserContext: Failed to fetch admin stadium", err));
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        city,
        setCity,
        stadiumLocation,
        setStadiumLocation,
        stadiumId,
        setStadiumId,
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

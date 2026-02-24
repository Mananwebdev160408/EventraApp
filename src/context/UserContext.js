import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import * as Location from "expo-location";
import { useAuth } from "./AuthContext";
import { Client } from "@stomp/stompjs";
import { API_CONFIG } from "../api/config";
import { stadiumService } from "../api/services";
// import "text-encoding";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [city, setCity] = useState("Detecting..."); // Default city
  const [stadiumLocation, setStadiumLocation] = useState("Stadium Name"); // Admin's stadium location
  const [stadiumId, setStadiumId] = useState(null); // Admin's stadium ID
  const [role, setRole] = useState("fan"); // 'fan' or 'admin'

  const updateLocation = async () => {
    try {
      console.log("Requesting location permissions...");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status:", status);

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setCity("Location Denied");
        return;
      }

      // 2. Get current position
      console.log("Fetching current position...");
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log("Raw location data:", location);

      // 3. Reverse geocode to get city name
      console.log("Starting reverse geocoding...");
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("Geocode result:", geocode);

      if (geocode.length > 0) {
        const address = geocode[0];
        console.log("Address component 0:", address);
        const cityName =
          address.city || address.district || address.region || "Unknown City";
        console.log("Calculated city name:", cityName);
        setCity(cityName);
      } else {
        console.warn("No geocode results found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setCity("Location Error");
    }
  };

  const { userInfo } = useAuth();
  const reportingTimer = useRef(null);
  const stompClient = useRef(null);

  useEffect(() => {
    console.log("UserProvider mounted, triggering auto-location update...");
    updateLocation();
  }, []);

  // Update role and fetch stadium info if admin
  useEffect(() => {
    if (userInfo?.role) {
      setRole(userInfo.role.toLowerCase());
    } else {
      setRole("fan");
      setStadiumLocation("Stadium Name");
      setStadiumId(null);
    }

    const fetchAdminStadium = async () => {
      if (
        userInfo &&
        (userInfo.roles?.includes("admin") ||
          userInfo.roles?.includes("ROLE_ADMIN") ||
          userInfo.role === "admin" ||
          userInfo.role === "ADMIN")
      ) {
        try {
          const stadiums = await stadiumService.getAllStadiums();
          const myStadium = stadiums.find(
            (s) =>
              s.adminEmail === userInfo.email ||
              s.adminEmail === userInfo.username,
          );
          if (myStadium) {
            // Update stadium location with name and city
            const locationStr =
              myStadium.city && myStadium.state
                ? `${myStadium.name}, ${myStadium.city}`
                : myStadium.name;
            setStadiumLocation(locationStr);
            setStadiumId(myStadium.id);
          }
        } catch (error) {
          console.error("Error fetching admin stadium in UserContext:", error);
        }
      }
    };

    fetchAdminStadium();
  }, [userInfo]);

  // Persistent location reporting for the stadium heatmap
  useEffect(() => {
    if (userInfo?.id) {
      console.log(`Initializing heatmap reporting for User ID: ${userInfo.id}`);

      // Initialize WebSocket connection
      const socketUrl = API_CONFIG.BASE_URL.replace("http", "ws") + "/ws";
      stompClient.current = new Client({
        brokerURL: socketUrl,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("Background Heatmap WebSocket Connected");
          // Start periodic reporting once connected
          reportToHeatmap();
          reportingTimer.current = setInterval(reportToHeatmap, 30000);
        },
        onStompError: (frame) => {
          console.error("Background STOMP error", frame);
        },
      });

      stompClient.current.activate();
    } else {
      stopReporting();
    }

    return () => {
      stopReporting();
    };
  }, [userInfo?.id]);

  const stopReporting = () => {
    if (reportingTimer.current) {
      clearInterval(reportingTimer.current);
      reportingTimer.current = null;
    }
    if (stompClient.current) {
      stompClient.current.deactivate();
      stompClient.current = null;
    }
    console.log("Heatmap reporting stopped");
  };

  const reportToHeatmap = async () => {
    if (!userInfo?.id || !stompClient.current?.connected) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const payload = {
        userId: userInfo.id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      console.log("Publishing GPS to WebSocket heatmap:", payload);
      stompClient.current.publish({
        destination: "/app/location/update",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Heatmap background reporting failed:", error);
    }
  };

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

import React, { createContext, useContext, useState, useEffect } from "react";
import * as Location from "expo-location";

// Create a new context for user location
const UserLocationContext = createContext();

// UserLocationProvider component provides user location to its children
export const UserLocationProvider = ({ children }) => {
  // State to store user location
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Call the function to request location permission
    getLocationPermission();
  }, []);

  // Function to request location permission and update user location
  const getLocationPermission = async () => {
    // Request foreground location permission from the user
    const { status } = await Location.requestForegroundPermissionsAsync();

    // Check if permission is granted
    if (status !== "granted") {
      console.error("Location permission denied");
    }

    // Get the current user's location coordinates
    const location = await Location.getCurrentPositionAsync({});

    // Set the user location in the state
    setUserLocation(location.coords);
  };

  // Provide the user location to its children components using the context
  return (
    <UserLocationContext.Provider value={userLocation}>
      {children}
    </UserLocationContext.Provider>
  );
};

// Custom hook to easily access the user location from any component
export const useUserLocation = () => {
  return useContext(UserLocationContext);
};

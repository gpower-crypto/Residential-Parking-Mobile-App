import NearbyParking from "./NearbyParking"; // Import the NearbyParking component
import fetchParkingData from "./ParkingDataLoader"; // Import the function for fetching parking data
import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

const LocationSelectionScreen = ({ route }) => {
  const { selectedLocation } = route.params; // Get the selectedLocation from the route parameters
  const [parkingData, setParkingData] = useState([]); // Initialize state for parking data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch parking data using the fetchParkingData function
        const data = await fetchParkingData();

        // Filter out duplicate parking data based on CarParkID
        const uniqueData = data.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.CarParkID === item.CarParkID)
        );

        // Set the unique parking data in the state
        setParkingData(uniqueData);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Render the NearbyParking component with desiredLocation and parkingData */}
      <NearbyParking
        desiredLocation={selectedLocation}
        parkingData={parkingData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default LocationSelectionScreen;

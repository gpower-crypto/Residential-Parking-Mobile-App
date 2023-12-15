import NearbyParking from "./NearbyParking"; // Import the NearbyParking component
import fetchParkingData from "./ParkingDataLoader"; // Import the function for fetching parking data
import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

const LocationSelectionScreen = ({ route }) => {
  const { selectedLocation } = route.params; // Get the selectedLocation from the route parameters

  return (
    <View style={styles.container}>
      <NearbyParking desiredLocation={selectedLocation} />
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

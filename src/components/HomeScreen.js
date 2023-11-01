import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import LocationInput from "./LocationInput"; // Import LocationInput component
import { useUserLocation } from "./UserLocationContext"; // Import useUserLocation hook
import CompassArrow from "./CompassArrow"; // Import CompassArrow component

const HomeScreen = () => {
  // Get the user's location from the UserLocationContext
  const userLocation = useUserLocation();

  // Initialize state to store the selected location
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Get the navigation object for navigating to other screens
  const navigation = useNavigation();

  // Function to handle selecting a location
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    navigation.navigate("LocationSelection", {
      selectedLocation: location,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Render the LocationInput component and pass the selection handler */}
        <LocationInput onLocationSelect={handleLocationSelect} />
      </View>

      {/* Render the MapView with the user's location */}
      {userLocation && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Add a Marker to mark the user's location with a blue pin */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            pinColor="blue"
          />
        </MapView>
      )}

      {/* Render the CompassArrow component to display a compass arrow */}
      <CompassArrow />
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
  button: {
    marginTop: 20,
  },
});

export default HomeScreen;

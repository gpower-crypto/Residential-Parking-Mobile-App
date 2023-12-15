import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useUserLocation } from "./UserLocationContext";
import CompassArrow from "./CompassArrow";
import LocationInput from "./LocationInput";

const HomeScreen = () => {
  const userLocation = useUserLocation();

  return (
    <View style={styles.container}>
      <LocationInput />

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
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            pinColor="blue"
          />
        </MapView>
      )}

      <CompassArrow />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
  },
});

export default HomeScreen;

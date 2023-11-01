import React from "react";
import { View } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

const DrawRoute = ({ directions }) => {
  const transformedDirections = directions.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  // Coordinates for the start and end markers
  const startCoordinates = transformedDirections[0];
  const endCoordinates =
    transformedDirections[transformedDirections.length - 1];

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: startCoordinates.latitude,
          longitude: startCoordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Polyline
          coordinates={transformedDirections}
          strokeWidth={5}
          strokeColor="#00f" // Blue color for the route
        />

        {/* Marker for the start point */}
        <Marker coordinate={startCoordinates} title="Start" pinColor="green" />

        {/* Marker for the end point */}
        <Marker coordinate={endCoordinates} title="End" pinColor="red" />
      </MapView>
    </View>
  );
};

export default DrawRoute;

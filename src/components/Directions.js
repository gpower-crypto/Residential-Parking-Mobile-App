import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const Directions = ({ route }) => {
  // Extract the required data from the route parameters
  const { origin, destination, apiKey } = route.params;

  // Log the origin and destination for debugging purposes
  console.log(origin, destination);

  return (
    <View style={styles.container}>
      {/* Create a MapView to display the map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Add markers for the origin and destination with custom pin colors */}
        <Marker coordinate={origin} pinColor="green" title="Origin" />
        <Marker coordinate={destination} pinColor="red" title="Destination" />

        {/* Add MapViewDirections to render the route between origin and destination */}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={apiKey}
          strokeWidth={7} // Set the width of the route line
          strokeColor="dodgerblue" // Set the color of the route line
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Directions;

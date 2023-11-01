import React from "react";
import { View, StyleSheet } from "react-native";
import DrawRoute from "./DrawRoute"; // Import your DirectionsMap component

const DirectionsScreen = ({ route }) => {
  const { directions } = route.params;

  return (
    <View style={styles.container}>
      <DrawRoute directions={directions.directions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DirectionsScreen;

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Accelerometer } from "expo-sensors";

const CompassArrow = () => {
  // State variable to store the arrow's rotation angle
  const [arrowRotation, setArrowRotation] = useState(0);

  useEffect(() => {
    // Add an event listener to monitor accelerometer data
    const subscription = Accelerometer.addListener((accelerometerData) => {
      // Extract the x and y components of the accelerometer data
      const { x, y } = accelerometerData;
      // Calculate the rotation angle based on accelerometer data
      const rotation = Math.atan2(y, x) * (270 / Math.PI);
      // Update the arrow's rotation angle in the state
      setArrowRotation(rotation);
    });

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  // Apply a rotation threshold to reduce sensitivity
  const rotationThreshold = 0.1;
  // Round the rotation angle to the nearest threshold value
  const adjustedRotation =
    Math.round(arrowRotation / rotationThreshold) * rotationThreshold;

  return (
    <View
      style={{
        position: "absolute",
        // Apply the adjusted rotation angle to the arrow's view
        transform: [{ rotate: `${adjustedRotation}deg` }],
        top: 90,
        right: 20,
      }}
    >
      <View style={styles.arrowBox}>
        {/* Display a compass icon using Ionicons */}
        <Ionicons name="compass-sharp" size={35} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowBox: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CompassArrow;

import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LocationInput = () => {
  const [enteredLocation, setEnteredLocation] = useState("");
  const navigation = useNavigation();

  const validateLocation = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          enteredLocation
        )}&format=json&limit=1`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.length > 0) {
          // Location is valid, proceed with operations
          navigation.navigate("LocationSelection", {
            selectedLocation: {
              latitude: parseFloat(result[0].lat),
              longitude: parseFloat(result[0].lon),
            },
          });
        } else {
          // Location not found
          Alert.alert(
            "Invalid Location",
            "The entered location could not be found."
          );
        }
      } else {
        // Handle API error
        Alert.alert(
          "API Error",
          "There was an error with the location validation API."
        );
      }
    } catch (error) {
      // Handle general error
      console.error("Error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search here"
        value={enteredLocation}
        onChangeText={(text) => setEnteredLocation(text)}
        onSubmitEditing={validateLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ccc",
    paddingHorizontal: 19,
    paddingVertical: 5,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
});

export default LocationInput;

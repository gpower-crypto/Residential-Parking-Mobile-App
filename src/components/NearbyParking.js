import haversineDistance from "haversine-distance";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserLocation } from "./UserLocationContext"; // Import useUserLocation hook

function NearbyParking({ desiredLocation, parkingData }) {
  const [nearbyParkingLocations, setNearbyParkingLocations] = useState([]);
  const navigation = useNavigation();
  const [message, setMessage] = useState(null);
  const [messageVisible, setMessageVisible] = useState(false);
  const userLocation = useUserLocation();

  useEffect(() => {
    const fetchNearbyResidentialAreas = async () => {
      try {
        const apiUrl = `http://192.168.68.104:4000/api/residential_areas/nearby?latitude=${desiredLocation.latitude}&longitude=${desiredLocation.longitude}&radius=1000`;

        const response = await fetch(apiUrl, {
          method: "GET",
        });

        if (!response.ok) {
          console.error("Error fetching nearby residential areas");
          return;
        }

        const data = await response.json();
        console.log(data);

        // Assuming your API returns an array of residential areas
        setNearbyParkingLocations(data.residentialAreas);
      } catch (error) {
        console.error("Error fetching nearby residential areas:", error);
      }
    };

    fetchNearbyResidentialAreas();
  }, [desiredLocation]);

  const storeParkingChoice = async (selectedLocation, key) => {
    try {
      // Retrieve the existing choices from AsyncStorage
      const existingChoices = await AsyncStorage.getItem(key);

      // Parse the existing choices as JSON (or initialize an empty array)
      const choices = existingChoices ? JSON.parse(existingChoices) : [];

      // Check if the location is already saved
      const isAlreadySaved = choices.some(
        (savedLocation) => savedLocation.id === selectedLocation.id
      );

      if (!isAlreadySaved) {
        // Add the new choice to the array
        choices.push(selectedLocation);

        // Store the updated choices back in AsyncStorage using the provided key
        await AsyncStorage.setItem(key, JSON.stringify(choices));

        setMessage("Location saved!");
      } else {
        setMessage("Location is already saved!");
      }

      setTimeout(() => {
        setMessage(null);
        setMessageVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Error storing parking choice:", error);
    }
  };

  const handleLocationClick = (location) => {
    // Store the location as a regular parking choice
    storeParkingChoice(location, "regularParkingChoices");

    navigation.navigate("ParkingDetails", {
      selectedLocation: location,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Parking Locations:</Text>
      {messageVisible && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
      {nearbyParkingLocations.length ? (
        <FlatList
          data={nearbyParkingLocations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLocationClick(item)}>
              <View style={styles.locationItem}>
                <Text style={styles.locationName}>{item.area_name}</Text>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    storeParkingChoice(item, "savedParkingChoices");
                    setMessageVisible(true);
                  }}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noParkingContainer}>
          <Text style={styles.noParkingText}>
            No available parking spots nearby.
          </Text>
          <Text style={styles.noParkingText}>
            Please try searching for a different location in Singapore.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#333",
  },
  locationItem: {
    marginBottom: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  locationName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageContainer: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "center",
    marginVertical: 10,
  },
  messageText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noParkingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noParkingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default NearbyParking;

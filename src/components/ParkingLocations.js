import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useUserLocation } from "./UserLocationContext";

function ParkingLocations({ type }) {
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();
  const userLocation = useUserLocation(); // Use the user location context
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const storageKey =
    type === "recent" ? "regularParkingChoices" : "savedParkingChoices";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the stored parking choices from AsyncStorage
        const storedChoices = await AsyncStorage.getItem(storageKey);

        if (storedChoices) {
          const parsedChoices = JSON.parse(storedChoices);
          // Reverse the array to get the latest choices first
          const reversedChoices = parsedChoices.reverse();

          // If the type is "recent," limit the displayed recent parking choices to the top 10 most recent
          const filteredChoices =
            type === "recent"
              ? reversedChoices.slice(0, Math.min(reversedChoices.length, 10))
              : reversedChoices;

          setLocations(filteredChoices);

          // Update AsyncStorage with the filtered choices
          await AsyncStorage.setItem(
            storageKey,
            JSON.stringify(filteredChoices)
          );
        }

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [type]);

  const handleLocationClick = (location) => {
    // Navigate to the "ParkingDetails" screen and pass the selected location and user location
    navigation.navigate("ParkingDetails", {
      selectedLocation: location,
      userLocation: userLocation, // Use the user location from the context
    });
  };

  if (!isDataLoaded) {
    // Return a loading indicator here until the data is loaded
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === "recent"
          ? "Recent Parking Choices"
          : "Saved Parking Locations"}
      </Text>
      {locations.length ? (
        <FlatList
          data={locations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLocationClick(item)}>
              <View style={styles.locationItem}>
                <Text>{item.Development || item.area_name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {type === "recent"
              ? "No recent parking spots chosen yet."
              : "No saved parking locations yet."}
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
    marginBottom: 10,
    color: "#333",
  },
  locationItem: {
    marginBottom: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
});

export default ParkingLocations;

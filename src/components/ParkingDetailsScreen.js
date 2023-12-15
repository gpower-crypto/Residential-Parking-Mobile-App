import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserLocation } from "./UserLocationContext";

const ParkingDetailsScreen = ({ route }) => {
  const { selectedLocation } = route.params; // Get the selectedLocation from the route parameters
  const navigation = useNavigation(); // Access the navigation object
  const userLocation = useUserLocation(); // Use the userLocation from the context
  const [availability, setAvailability] = useState();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // State to store the new availability input
  const [newAvailability, setNewAvailability] = useState("");
  const [isGetDirectionsButtonDisabled, setIsGetDirectionsButtonDisabled] =
    useState(false);
  const [directionsMessage, setDirectionsMessage] = useState();
  const [directions, setDirections] = useState(null);

  // State for countdown timer
  const [countdown, setCountdown] = useState(null);

  // Function to start the countdown timer
  const startCountdown = (seconds) => {
    setCountdown(seconds);
  };

  // Effect to decrement the countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Function to reset the countdown timer
  const resetCountdown = () => {
    setCountdown(null);
  };

  // Function to open the edit modal
  const handleEditAvailability = () => {
    setIsEditModalVisible(true);
  };

  // Function to close the edit modal
  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    // Clear the input field when closing the modal
    setNewAvailability("");
  };

  // Function to submit the updated availability
  const handleSubmitAvailability = async () => {
    // Make an API request to update the availability
    try {
      const apiUrl = `http://192.168.68.101:3000/showOrUpdate/addOrUpdateParkingAvailability?locationId=${selectedLocation.id}&available=${newAvailability}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available: newAvailability }),
      });

      if (!response.ok) {
        console.error("Error updating parking availability");
        return;
      }

      // Close the edit modal after successful update
      handleEditModalClose();

      // Fetch the updated availability
      fetchAvailability();
    } catch (error) {
      console.error("Error updating parking availability:", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const apiUrl = `http://192.168.68.101:3000/showOrUpdate/parking-availability?locationId=${selectedLocation.id}`;

      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        return;
      }

      const availability = await response.json();

      // Assuming your API returns an array of residential areas
      setAvailability(availability);
    } catch (error) {
      console.error(
        "Error fetching parking availability of residential areas:",
        error
      );
    }
  };
  fetchAvailability();

  // Function to handle getting directions
  const handleGetDirections = async () => {
    // Disable the button to prevent multiple clicks
    setIsGetDirectionsButtonDisabled(true);
    // Clear the directions message
    setDirectionsMessage(null);
    // Start the countdown timer (e.g., 10 seconds)
    startCountdown(10);

    try {
      // Make an API call to get directions
      const apiUrl = `http://192.168.68.101:3000/directions/getDirections?startLat=${userLocation.latitude}&startLong=${userLocation.longitude}&endLat=${selectedLocation.lat}&endLong=${selectedLocation.long}`;
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      // Clear the countdown timer
      resetCountdown();

      if (!response.ok) {
        // console.error("Error getting directions");
        // Show an error message on the screen
        setDirectionsMessage("No path found to the location");
        return;
      }

      const directions = await response.json();
      console.log(directions);
      if (
        directions &&
        directions.directions &&
        directions.directions.length > 0
      ) {
        // Navigate to a DirectionsScreen and pass the 'directions' data
        navigation.navigate("DirectionsScreen", { directions });
      } else {
        // Handle the case where no directions are available
        setDirectionsMessage("No directions available for this route.");
      }
    } catch (error) {
      console.error("Error getting directions:", error);
      // Show an error message on the screen
      setDirectionsMessage("An error occurred while fetching directions.");
    } finally {
      // Re-enable the button
      setIsGetDirectionsButtonDisabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking Availability Details</Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.text}>{selectedLocation.area_name}</Text>
      {availability && availability.available !== undefined ? (
        <>
          <Text style={styles.label}>
            Available Lots ({availability?.date || ""}):
          </Text>
          <Text style={styles.text}>{availability.available}</Text>
          {availability.predictedAvailability && (
            <>
              <Text style={styles.label}>
                Predicted Availabile Lots Currently:
              </Text>
              <Text style={styles.text}>
                {availability.predictedAvailability}
              </Text>
            </>
          )}
        </>
      ) : (
        <Text style={styles.text}>
          {availability && availability.message
            ? availability.message
            : "No parking availability data available for this location."}
        </Text>
      )}
      {directionsMessage && ( // Check if there's a message to display
        <Text style={styles.text}>{directionsMessage}</Text>
      )}
      {/* Button to trigger handleGetDirections */}
      <Button
        title="Get Directions"
        onPress={handleGetDirections}
        style={styles.button}
        disabled={isGetDirectionsButtonDisabled}
      />
      {countdown !== null && (
        <Text style={styles.text}>
          Loading directions in {countdown} seconds...
        </Text>
      )}
      <Button
        title="Edit Availability"
        onPress={handleEditAvailability}
        style={styles.button}
      />
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Availability</Text>
          <TextInput
            style={styles.input}
            placeholder="New Availability"
            value={newAvailability}
            onChangeText={(text) => setNewAvailability(text)}
          />
          <Button title="Submit" onPress={handleSubmitAvailability} />
          <Button title="Close" onPress={handleEditModalClose} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: "bold",
    color: "#666",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 14,
  },
  button: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },

  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#fff",
  },
});

export default ParkingDetailsScreen;

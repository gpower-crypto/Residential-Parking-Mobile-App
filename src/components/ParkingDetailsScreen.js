import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserLocation } from "./UserLocationContext";

const ParkingDetailsScreen = ({ route }) => {
  const { selectedLocation } = route.params;
  const navigation = useNavigation();
  const userLocation = useUserLocation();
  const [availability, setAvailability] = useState();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newAvailability, setNewAvailability] = useState("");
  const [isGetDirectionsButtonDisabled, setIsGetDirectionsButtonDisabled] =
    useState(false);
  const [directionsMessage, setDirectionsMessage] = useState();
  const [countdown, setCountdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const startCountdown = (seconds) => {
    setCountdown(seconds);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const resetCountdown = () => {
    setCountdown(null);
  };

  const handleEditAvailability = () => {
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setNewAvailability("");
  };

  const handleSubmitAvailability = async () => {
    try {
      setIsLoading(true);

      // Update local state with the new availability immediately
      setAvailability((prevAvailability) => ({
        ...prevAvailability,
        available: newAvailability,
      }));

      const apiUrl = `http://parking-api-LB-1578947644.us-east-1.elb.amazonaws.com:3000/showOrUpdate/addOrUpdateParkingAvailability?locationId=${selectedLocation.id}&available=${newAvailability}`;
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

      handleEditModalClose();
      fetchAvailability();
    } catch (error) {
      console.error("Error updating parking availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const apiUrl = `http://parking-api-LB-1578947644.us-east-1.elb.amazonaws.com:3000/showOrUpdate/parking-availability?locationId=${selectedLocation.id}`;

      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        return;
      }

      const newAvailability = await response.json();
      setAvailability(newAvailability);
    } catch (error) {
      console.error("Error fetching parking availability:", error);
    }
  };

  const handleGetDirections = async () => {
    setIsGetDirectionsButtonDisabled(true);
    setDirectionsMessage(null);
    startCountdown(20);

    try {
      const apiUrl = `http://parking-api-LB-1578947644.us-east-1.elb.amazonaws.com:3000/directions/getDirections?startLat=${userLocation.latitude}&startLong=${userLocation.longitude}&endLat=${selectedLocation.lat}&endLong=${selectedLocation.long}`;
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      resetCountdown();

      if (!response.ok) {
        setDirectionsMessage("No path found to the location");
        return;
      }

      const directions = await response.json();

      if (
        directions &&
        directions.directions &&
        directions.directions.length > 0
      ) {
        navigation.navigate("DirectionsScreen", { directions });
      } else {
        setDirectionsMessage("No directions available for this route.");
      }
    } catch (error) {
      console.error("Error getting directions:", error);
      setDirectionsMessage("An error occurred while fetching directions.");
    } finally {
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
                Predicted Available Lots Currently:
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

      {directionsMessage && (
        <Text style={styles.text}>{directionsMessage}</Text>
      )}

      <View style={styles.buttonContainer}>
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
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Edit Availability"
          onPress={handleEditAvailability}
          style={styles.button}
        />
      </View>

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

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
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
  buttonContainer: {
    marginTop: 20,
  },
});

export default ParkingDetailsScreen;

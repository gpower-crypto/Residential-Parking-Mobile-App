import React from "react";
import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

function LocationInput({ onLocationSelect }) {
  // Function to handle location selection
  const handleLocationSelect = async (data, details = null) => {
    const { description } = data;

    // Extract the latitude and longitude from details
    const { geometry } = details;
    const { location } = geometry;
    const { lat, lng } = location;

    // Call the provided onLocationSelect callback with the selected location
    onLocationSelect({ latitude: lat, longitude: lng });
  };

  return (
    <View style={{ padding: 12 }}>
      {/* Render the GooglePlacesAutocomplete component */}
      <GooglePlacesAutocomplete
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            fontSize: 15,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: "#ccc",
            paddingHorizontal: 19,
          },
          listView: {
            backgroundColor: "#fff",
          },
        }}
        placeholder="Search here"
        onPress={(data, details) => handleLocationSelect(data, details)}
        fetchDetails={true}
        query={{
          key: "AIzaSyCAe1LFhjjHABCh3fJUKm2vtkChOegsx6E",
          language: "en",
        }}
      />
    </View>
  );
}

export default LocationInput;

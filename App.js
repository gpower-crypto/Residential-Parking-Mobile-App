import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/components/HomeScreen";
import ParkingDetailsScreen from "./src/components/ParkingDetailsScreen";
import DirectionsScreen from "./src/components/DirectionsMap";
import SidebarMenu from "./src/components/SidebarMenu";
import LocationSelectionScreen from "./src/components/LocationSelectionScreen";
import { Ionicons } from "@expo/vector-icons";
import { UserLocationProvider } from "./src/components/UserLocationContext";
import { navigationRef } from "./src/components/RootNavigation";
import ParkingLocationsWrapper from "./src/components/ParkingLocationsWrapper";

const Stack = createStackNavigator();

function App() {
  // State to manage the visibility of the sidebar menu
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* Wrap the entire app with the UserLocationProvider to provide user location */}
      <UserLocationProvider>
        <Stack.Navigator initialRouteName="Home">
          {/* Define app navigation screens */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: "Home",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => setIsMenuVisible(true)}
                  style={styles.menuButton}
                >
                  {/* Add a menu icon to open the sidebar */}
                  <Ionicons name="menu-sharp" size={28} color="black" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="LocationSelection"
            component={LocationSelectionScreen}
          />
          <Stack.Screen
            name="ParkingDetails"
            component={ParkingDetailsScreen}
          />
          <Stack.Screen name="DirectionsScreen" component={DirectionsScreen} />
          <Stack.Screen
            name="Parking Locations"
            component={ParkingLocationsWrapper}
          />
        </Stack.Navigator>
        {/* Render the sidebar menu */}
        <SidebarMenu
          isVisible={isMenuVisible}
          onClose={() => setIsMenuVisible(false)}
        />
      </UserLocationProvider>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  menuButton: {
    marginTop: 8,
    marginRight: 25,
  },
  menuButtonText: {
    fontSize: 18,
    color: "#333",
  },
});

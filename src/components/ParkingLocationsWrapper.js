import React from "react";
import ParkingLocations from "./ParkingLocations";

const ParkingLocationsWrapper = ({ route, navigation }) => {
  const { type } = route.params;

  return <ParkingLocations type={type} navigation={navigation} />;
};

export default ParkingLocationsWrapper;

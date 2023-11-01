import { NavigationContainer, CommonActions } from "@react-navigation/native";
import React from "react";

// navigation reference
export const navigationRef = React.createRef();

// function to navigate using the reference
export function navigate(name, params) {
  navigationRef.current?.dispatch(CommonActions.navigate(name, params));
}

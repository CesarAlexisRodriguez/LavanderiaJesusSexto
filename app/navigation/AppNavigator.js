import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import CreateClientScreen from "../screens/CreateClientScreen";
import UpdateClientScreen from "../screens/UpdateClientScreen";
import ClientListScreen from "../screens/ClientListScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateUser" component={CreateUserScreen} />
      <Stack.Screen name="ClientList" component={ClientListScreen} />
      <Stack.Screen name="CreateClient" component={CreateClientScreen} />
      <Stack.Screen name="UpdateClient" component={UpdateClientScreen} />
    </Stack.Navigator>
  );
}

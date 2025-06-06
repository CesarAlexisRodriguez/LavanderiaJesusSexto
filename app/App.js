import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import CreateUserScreen from './screens/CreateUserScreen';
import ClientListScreen from './screens/ClientListScreen';
import CreateClientScreen from './screens/CreateClientScreen';
import UpdateClientScreen from './screens/UpdateClientScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#2E86AB' },
            headerTintColor: 'white',
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Iniciar Sesión' }}
          />
          <Stack.Screen
            name="CreateUser"
            component={CreateUserScreen}
            options={{ title: 'Registrar Usuario' }}
          />
          <Stack.Screen
            name="ClientList"
            component={ClientListScreen}
            options={{ title: 'Clientes' }}
          />
          <Stack.Screen
            name="CreateClient"
            component={CreateClientScreen}
            options={{ title: 'Crear Cliente' }}
          />
          <Stack.Screen
            name="UpdateClient"
            component={UpdateClientScreen}
            options={{ title: 'Actualizar Cliente' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

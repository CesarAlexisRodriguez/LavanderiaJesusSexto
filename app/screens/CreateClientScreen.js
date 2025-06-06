import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import request from '../utils/request';

export default function CreateClientScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  const handleCreateClient = async () => {
    if (!name || !phone || !address) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await request.post('/clients/create', {
        name: name,
        phone_number: phone,
        address: address,
      });
      Alert.alert('Éxito', 'Cliente creado exitosamente');
      navigation.navigate('ClientList');
    } catch (error) {
      console.error('Create client error:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo crear el cliente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cliente</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateClient}>
        <Text style={styles.buttonText}>Guardar Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

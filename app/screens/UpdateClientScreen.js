import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function UpdateClientScreen({ route, navigation }) {
  const { clientId, currentName, currentEmail } = route.params;
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const { token } = useAuth();

  const handleUpdate = async () => {
    try {
      const res = await fetch(` http://127.0.0.1:5000/clients/update/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Client updated');
        navigation.navigate('ClientList');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Client</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});

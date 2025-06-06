// screens/ClientListScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import request from '../utils/request';
import { useNavigation } from '@react-navigation/native';

export default function ClientListScreen() {
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [clients, setClients] = useState([]);
  const navigation = useNavigation();


  const fetchByName = async () => {
    if (!searchName.trim()) {
      Alert.alert('Error', 'Ingresa al menos una letra para buscar por nombre');
      return;
    }
    try {
      const response = await request.get(`/clients/search/name?name=${encodeURIComponent(searchName.trim())}`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching by name:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudieron cargar los clientes por nombre');
    }
  };

  
  const fetchByPhone = async () => {
    if (!searchPhone.trim()) {
      Alert.alert('Error', 'Ingresa un número de teléfono para buscar');
      return;
    }
    try {
      const response = await request.get(`/clients/search/phone?phone=${encodeURIComponent(searchPhone.trim())}`);
      
      if (response.status === 200) {
        setClients([response.data]); 
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('No encontrado', 'No hay cliente con ese teléfono');
        setClients([]);
      } else {
        console.error('Error fetching by phone:', error.response?.data || error.message);
        Alert.alert('Error', 'No se pudo buscar el cliente por teléfono');
      }
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('UpdateClient', { client: item })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.subtext}>Teléfono: {item.phone_number}</Text>
      <Text style={styles.subtext}>Dirección: {item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Clientes</Text>

      
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre"
          value={searchName}
          onChangeText={setSearchName}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchByName}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

    
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por teléfono"
          value={searchPhone}
          onChangeText={setSearchPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchByPhone}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      
      {clients.length > 0 ? (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay clientes para mostrar</Text>
        </View>
      )}

      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateClient')}
      >
        <Text style={styles.addButtonText}>+ Nuevo Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E86AB',
  },
  searchSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#2E86AB',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingTop: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#333',
  },
  subtext: {
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777',
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#28A745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

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

  // Para saber qué cliente estamos editando
  const [editingClientId, setEditingClientId] = useState(null);
  // Campos de edición
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const navigation = useNavigation();

  // Buscar por nombre
  const fetchByName = async () => {
    if (!searchName.trim()) {
      Alert.alert('Error', 'Ingresa al menos una letra para buscar por nombre');
      return;
    }
    try {
      const response = await request.get(
        `/clients/search/name?name=${encodeURIComponent(searchName.trim())}`
      );
      setClients(response.data);
      resetEditing();
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
      const response = await request.get(
        `/clients/search/phone?phone=${encodeURIComponent(searchPhone.trim())}`
      );
      if (response.status === 200) {
        setClients([response.data]);
        resetEditing();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('No encontrado', 'No hay cliente con ese teléfono');
        setClients([]);
        resetEditing();
      } else {
        console.error('Error fetching by phone:', error.response?.data || error.message);
        Alert.alert('Error', 'No se pudo buscar el cliente por teléfono');
      }
    }
  };


  const startEdit = (client) => {
    setEditingClientId(client.id);
    setEditName(client.name);
    setEditPhone(client.phone_number);
    setEditAddress(client.address);
  };

 
  const cancelEdit = () => {
    resetEditing();
  };

  const resetEditing = () => {
    setEditingClientId(null);
    setEditName('');
    setEditPhone('');
    setEditAddress('');
  };


  const saveEdit = async (clientId) => {
    if (!editName.trim() || !editPhone.trim() || !editAddress.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    try {
      await request.put(`/clients/update/${clientId}`, {
        name: editName.trim(),
        phone_number: editPhone.trim(),
        address: editAddress.trim(),
      });

      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? { ...c, name: editName.trim(), phone_number: editPhone.trim(), address: editAddress.trim() }
            : c
        )
      );
      Alert.alert('Éxito', 'Cliente actualizado correctamente');
      resetEditing();
    } catch (error) {
      console.error('Update client error:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo actualizar el cliente');
    }
  };


  const handleDelete = async (clientId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Seguro que deseas eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await request.delete(`/clients/delete/${clientId}`);
              setClients((prev) => prev.filter((c) => c.id !== clientId));
              Alert.alert('Eliminado', 'Cliente eliminado correctamente');
              resetEditing();
            } catch (error) {
              console.error('Delete client error:', error.response?.data || error.message);
              Alert.alert('Error', 'No se pudo eliminar el cliente');
            }
          },
        },
      ]
    );
  };


  const renderItem = ({ item }) => {
    if (item.id === editingClientId) {
      // Modo edición
      return (
        <View style={[styles.itemContainer, styles.editContainer]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={editName}
            onChangeText={setEditName}
            placeholder="Nombre"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginTop: 8 }]}
            value={editPhone}
            onChangeText={setEditPhone}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginTop: 8 }]}
            value={editAddress}
            onChangeText={setEditAddress}
            placeholder="Dirección"
          />
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.buttonSmall, styles.saveButton]}
              onPress={() => saveEdit(item.id)}
            >
              <Text style={styles.buttonTextSmall}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonSmall, styles.cancelButton]}
              onPress={cancelEdit}
            >
              <Text style={styles.buttonTextSmall}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

  
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subtext}>Teléfono: {item.phone_number}</Text>
          <Text style={styles.subtext}>Dirección: {item.address}</Text>
        </View>
        <View style={styles.itemButtons}>
          <TouchableOpacity
            style={[styles.buttonSmall, styles.editButton]}
            onPress={() => startEdit(item)}
          >
            <Text style={styles.buttonTextSmall}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSmall, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.buttonTextSmall}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Clientes</Text>

      
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre"
          value={searchName}
          onChangeText={setSearchName}
          returnKeyType="search"
          onSubmitEditing={fetchByName}
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
          returnKeyType="search"
          onSubmitEditing={fetchByPhone}
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
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  editContainer: {
    flexDirection: 'column',
  },
  itemInfo: {
    flex: 1,
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
  itemButtons: {
    justifyContent: 'space-between',
  },
  buttonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  editButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  saveButton: {
    backgroundColor: '#28A745',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    marginTop: 4,
  },
  buttonTextSmall: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
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

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { insertItem } from './sql';
import * as Notifications from 'expo-notifications';
import ProductList from './ProductList'; // Import the ProductList component
import axios from 'axios';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ title: 'Add Product' }}
        />
        <Stack.Screen
          name="ProductList"
          component={ProductList} // Ensure that ProductList is properly imported
          options={{ title: 'Product List' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const AddProductScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handleAddProduct = async () => {
    if (!title || !price) {
      Alert.alert('Error', 'Please enter both title and price');
      return;
    }

    try {
      await insertItem({ title, price });
      setTitle('');
      setPrice('');

      // Display a push notification
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Product Added Successfully',
          body: 'The product has been added to the database.',
        },
        trigger: null,
      });

      Alert.alert('Success', 'Product added successfully');
      navigation.navigate('ProductList');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter item title"
      />
      <Text style={styles.label}>Item Price:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter item price"
        keyboardType="numeric"
      />
      <Button title="Add Items" onPress={handleAddProduct} />
      <Button
        title="View Items"
        onPress={() => navigation.navigate('ProductList')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

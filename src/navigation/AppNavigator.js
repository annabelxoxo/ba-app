import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import NewsDetailsScreen from '../screens/NewsDetailsScreen';
import CampusDetailsScreen from '../screens/CampusDetailsScreen';
import { BRAND } from '../constants/colors';

import GameScreen from '../screens/GameScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: BRAND.green },
          headerTintColor: BRAND.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Busleyden Atheneum' }} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product' }} />
        <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} options={{ title: 'Nieuws' }} />
        <Stack.Screen name="CampusDetails" component={CampusDetailsScreen} options={{ title: 'Campus' }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Mini-game' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
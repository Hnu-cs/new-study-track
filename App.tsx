import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from './src/store';
import HomeScreen from './src/screens/home/HomeScreen';
import CalendarScreen from './src/screens/calendar/CalendarScreen';
import MistakesScreen from './src/screens/mistakes/MistakesScreen';
import KeypointsScreen from './src/screens/keypoints/KeypointsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import { storage } from './src/services/storage';

const Tab = createBottomTabNavigator();

export default function App() {
  const { isLoading, loadData } = useAppStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadData();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [loadData]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Calendar') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Mistakes') {
                iconName = focused ? 'alert-circle' : 'alert-circle-outline';
              } else if (route.name === 'Keypoints') {
                iconName = focused ? 'bookmark' : 'bookmark-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else {
                iconName = 'help-circle';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#10B981',
            tabBarInactiveTintColor: '#6B7280',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Mistakes" component={MistakesScreen} />
          <Tab.Screen name="Keypoints" component={KeypointsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

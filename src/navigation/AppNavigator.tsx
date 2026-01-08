import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import MistakesScreen from '../screens/mistakes/MistakesScreen';
import KeypointsScreen from '../screens/keypoints/KeypointsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  return <Text style={{ color: focused ? '#3B82F6' : '#9CA3AF' }}>{name}</Text>;
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: '主页',
            tabBarIcon: ({ focused }) => <TabBarIcon name="🏠" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarLabel: '日历',
            tabBarIcon: ({ focused }) => <TabBarIcon name="📅" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Mistakes"
          component={MistakesScreen}
          options={{
            tabBarLabel: '错题',
            tabBarIcon: ({ focused }) => <TabBarIcon name="❌" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Keypoints"
          component={KeypointsScreen}
          options={{
            tabBarLabel: '重点',
            tabBarIcon: ({ focused }) => <TabBarIcon name="⭐" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: '我的',
            tabBarIcon: ({ focused }) => <TabBarIcon name="👤" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

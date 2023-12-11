import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './homeScreen.js';
import MyLibraryScreen from './MyLibrary.js';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'My Library') {
            iconName = focused ? 'library' : 'library-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarActiveTintColor="tomato"
      tabBarInactiveTintColor="gray"
      tabBarStyle={{
        display: 'flex',
      }}
    >
      <Tab.Screen name="Home" 
        component={HomeScreen}
        options={{title: 'Home', headerStyle: { backgroundColor: '#6699CC'}}}
       />
      <Tab.Screen name="My Library" 
        component={MyLibraryScreen}
        options={{title: 'Librarium', headerStyle: {backgroundColor: '#6699CC'}}} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, Image, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  HomeScreen  from './routes/homeScreen';
import AudioBook from './routes/Audiobook';
import AudioPlayerScreen from './routes/AudioPlayerScreen';
import BottomTabNavigator from './routes/BottomTab.js';




const Stack = createNativeStackNavigator(); //creating an object by calling this constructor which returns 2 properties 'Screen' and 'Navigator'

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Audify" component={BottomTabNavigator} options={{headerShown:false , title: 'Audify', headerStyle : { backgroundColor : '#6699CC', }, headerTintColor: '#f0f0f0', // Set the text color of the header
        headerTitleStyle: {
          fontWeight: 'bold', // Set the font weight of the header title
          fontSize: 24,},}} />
        <Stack.Screen name = "AudioBook" component = {AudioBook}/>
        <Stack.Screen name = "AudioPlayer" component = {AudioPlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    );
};

const styles = StyleSheet.create({
  container:  {
    flex: 1, // Take up all available space
    padding: 20, // Add padding around the content
    backgroundColor: '#040404', // Set a background color
  },
  title: {
    color : '#f0f0f0',
    textAlign : 'center',
    marginTop : 30,
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  bookList: {
    marginLeft : 5,
    marginTop: 20,
  },
  bookItem: {
    marginBottom: 10,
  },
  bookTitle: {
    color : '#f0f0f0',
    alignSelf : 'center',
    fontSize : 20,
    fontWeight: 'bold',
  },
  bookLink: {
    color: 'blue',
  },
  bookImage: {
    bordorRadius : 10,
    alignSelf : 'center',
    width: 150, 
    height: 200, 
    resizeMode: 'cover',
    marginBottom: 10, 
  },
});

export default App;

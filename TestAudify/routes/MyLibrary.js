
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyLibraryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Library</Text>
      {/* Add your library content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#040404',
  },
  title: {
    color: '#f0f0f0',
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default MyLibraryScreen;

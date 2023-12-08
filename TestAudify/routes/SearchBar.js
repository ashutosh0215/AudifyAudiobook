import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Button, StyleSheet, Keyboard } from 'react-native';

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="which book you want to listen to?"
        value={searchText}
        onChangeText={setSearchText}
        //onKeyPress={handleKeyPress}
        onSubmitEditing = {handleSearch}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 30,
  },
  input: {
    backgroundColor : '#c0c0c0',
    flex: 1,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button : {
    backgroundColor: '#c0c0c0', // Muted background color
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
});

export default SearchBar;

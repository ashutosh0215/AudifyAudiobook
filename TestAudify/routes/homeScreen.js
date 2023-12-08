import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, Image, View, Text, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import axios from 'axios'; // Import the axios library
import {Linking} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AudioBook from './Audiobook';




const HomeScreen = () => {
  const [bookList, setBookList] = useState([]);

  const navigation = useNavigation();

 


//asynchronous function that handles user text
  const handleSearch = async searchText => {
    try {
      const response = await axios.get(`http://192.168.1.10:5000/api/search?name=${searchText}`);
      setBookList(response.data); // Update the bookList state with the response data
      console.log(bookList);
    } catch (error) {
      console.error('Error:', error);
    }
  };


//asynchronous function that extracts the clicked link, requests scraping from backend and receives 
//an array list of audio sources for the particular book clicked

  const navigationHandler = async (book) => {
    const authorName = book[1];
    const link = book[3];
    const bookName = book[0];
    const bookimgURL = book[4];
    //console.log(bookName);
    navigation.navigate("AudioBook", { authorName,link, bookName, bookimgURL });
  };

  // function audiobookChapters(){
  //   return chapterList;
  // }

  // useEffect(()=>{
  //     console.log(chapterList);
  //     return audiobookChapters;
  //   },[chapterList]);



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SearchBar onSearch={handleSearch} /><Text>{"\n"}</Text>
      <ScrollView style={styles.bookList}>
        <Text style = {{fontStyle : 'italic', fontSize : 15}}>Results:</Text><Text>{"\n"}</Text>
        {bookList.map((book, index) => (
          <View key={index} style={styles.bookItem}>
            <TouchableOpacity onPress={()=>navigationHandler(book)}> 
              <Image
                source = {{ uri: book[4] }}
                style = {styles.bookImage}
              />
            </TouchableOpacity>
              <TouchableOpacity onPress={ () => Linking.openURL(book[3])}>
                <Text style={styles.bookTitle}>{book[0]} - {book[1]}</Text>
            </TouchableOpacity>
            <Text>{"\n"}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
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
    textAlign : 'center',
    color : '#f0f0f0',
    alignSelf : 'center',
    fontSize : 20,
    fontWeight: 'bold',
  },
  bookLink: {
    color: 'blue',
  },
  bookImage: {
    borderRadius : 10,
    alignSelf : 'center',
    width: 150, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: 'cover', // Image resizing mode
    marginBottom: 10, // Adjust margin as needed
  },
});

export default HomeScreen;

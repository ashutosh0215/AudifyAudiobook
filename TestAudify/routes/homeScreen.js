import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, Image, View, Text, StyleSheet, ImageBackground } from 'react-native';
import SearchBar from './SearchBar';
import axios from 'axios'; // Import the axios library
import {Linking} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AudioBook from './Audiobook';
import { Block, Card, Icon, Input } from 'galio-framework';



const HomeScreen = () => {
  const [bookList, setBookList] = useState([]);

  const navigation = useNavigation();

 


//asynchronous function that handles user text
  const handleSearch = async searchText => {
    try {
      const response = await axios.get(`http://192.168.1.4:5000/api/search?name=${searchText}`);
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
    navigation.navigate("AudioBook", { authorName, link, bookName, bookimgURL });
  };

  // function audiobookChapters(){
  //   return chapterList;
  // }

  // useEffect(()=>{
  //     console.log(chapterList);
  //     return audiobookChapters;
  //   },[chapterList]);

  // const titleStyle = {
  //   color: 'white',
  //   textAlign: 'center',
  //   fontSize: 10,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  // };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Block>
        <Input
          placeholder="Search Books"
          right
          icon="search1"
          family="antdesign"
          iconSize={16}
          iconColor="#666"
          onChangeText={handleSearch}
        />
      </Block>
      <ScrollView style={styles.bookList}>
        {bookList.map((book, index) => (
          <TouchableOpacity key={index} onPress={() => navigationHandler(book)}>
            <Card
              flex
              borderless
              image={`${book[4]}`}
              style={styles.bookItem}
            >
            <Text style={styles.customTitle}>{book[0]}</Text> 
              
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#040404',
  },
  bookList: {
    marginLeft: 5,
    marginTop: 20,
  },
  bookItem: {
    marginBottom: 10,
    
  },
  bookTitle: {
    textAlign: 'center',
    color: '#f0f0f0',
    alignSelf: 'center',
    fontSize: 50,
    fontWeight: 'bold',
  },
  customTitle: {
    // Add custom styles for the title
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  customCaption: {
    // Add custom styles for the caption
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardImage: {
    borderRadius: 10, // Adjust border radius of the image
    width: '100%', // Make the image take up the full width of the block
    height: '300', // Adjust the height as needed
    resizeMode: 'contain',
    overflow: 'hidden'
  },
});

export default HomeScreen;

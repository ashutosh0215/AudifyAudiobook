import React, { useState , useEffect } from 'react';
import { Button, ScrollView, Image, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//importing Audio from expo-av library
import {Audio} from 'expo-av';
//importing Permission library to ask for permissions to audio speakers
import { Permissions } from 'expo';
import axios from 'axios'; // Import the axios library
import { useNavigation } from '@react-navigation/native';



const AudioBook = ({ route }) =>{
	//importing link from Parent component homescreen
	//const { bookName } = route.params;
	const navigation = useNavigation();
	const { authorName, link, bookName, bookimgURL } = route.params;
	//console.log(bookName);
	const [bookDesc, setBookDesc] = useState('');

	const [chapterList, setChapterList] = useState([]);
	const [sound, setSound] = useState();
	const [isDescExpanded, setIsDescExpanded] = useState(false);

	const navigateToAudioPlayer = (chapterUrl) => {
		navigation.navigate('AudioPlayer',{
			chapterUrl,
			bookName,
			bookImage : bookimgURL,
		});
	};



	useEffect(() => {
		navigation.setOptions({
			headerStyle : { backgroundColor : '#6699CC',},
			headerTintColor : '#f0f0f0',
			headerTitleStyle : {fontWeight : 'bold',},
			headerTitle: bookName,
		});
	}, [bookName]);

	const chapList = async () => {
		try {
					const requestData = {
						bookName: bookName,
						authorName: authorName,
						link: link,
					};
      		const response = await axios.post(`http://192.168.1.4:5000/api/receivelink`, requestData);
      		setChapterList(response.data.linksarr);
      		setBookDesc(response.data.book_desc);
      		//console.log(response.data.book_desc);
      		//console.log(response.data);
      		console.log("\n"+'New Response from Flask received');
      		// console.log(response.data)
    	} 
   		catch (error) {
      		console.log("Error sending string to Flask", error);
    	}
    }
    useEffect(()=>{
    	chapList();
    },[]);


	//declaring an async function ; basically making this function wait for a promise from another async task
	async function playSound(url) {
		console.log('Loading Sound');
		
		//Audio.Sound.createAsync function asynchronously loads the audio specified by the url and return an object with info about loaded audio
		//await keyword ensures code waits for this operating before proceeding.
		// the object deconstructor { sound } is used to retrieve specific 'sound' property from object returned by the function
		const { sound } = await Audio.Sound.createAsync(
				{uri : url}
		);
		//setSound state re-render function is called with 'sound' property as an argument 
		//to re-render the state
		setSound(sound);

		console.log("playing audiobook");
		await sound.playAsync();
	}

	useEffect(()=>{
		//returns a ternary condition operator
		//checks if sound has true or false value
		//if true executes sound.unloadAsync()
		//if false return nothing 'undefined'
		return sound
		? ()=> {
			console.log("unloading Audio");
			//stops playback of the audio and releases system resources 
			sound.unloadAsync();
		}
		: undefined;
	}, [sound]);

	const toggleDescription = () => {
		setIsDescExpanded(!isDescExpanded);
	};

	const renderChapterItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => navigateToAudioPlayer(item)}
    >
      <Text style={styles.chapterText}>{`Chapter ${index + 1}`}</Text>
    </TouchableOpacity>
  );


	return(
		<View style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Image source={{ uri: bookimgURL }} style={styles.bookImage} />
            <Text style={styles.bookTitle}>{bookName}-{authorName}</Text>
            <TouchableOpacity onPress={toggleDescription}>
              <Text
                style={[
                  styles.content,
                  !isDescExpanded && styles.collapsedContent,
                  isDescExpanded && styles.expandedContent,
                ]}
                numberOfLines={isDescExpanded ? undefined : 3}
              >
                {bookDesc}
                {!isDescExpanded && (
                  <Text style={styles.toggleText}>
                    {'Read More'}
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          </>
        )}
        data={chapterList}
        renderItem={renderChapterItem}
        keyExtractor={(item, index) => `${index}`}
        contentContainerStyle={styles.chapterList}
      />
    </View>	
	);
}

const styles = StyleSheet.create({
  container: {
    flex : 1,// Take up all available space
    padding: 20, // Add padding around the content
    backgroundColor: '#040404', // Set a background color
  },
  chapterList: {
    marginTop: 20,
  },
  bookTitle: {
    textAlign : 'center',
    color : '#f0f0f0',
    alignSelf : 'center',
    fontSize : 25,
    fontWeight: 'bold',
  },
  content: {
    color: '#f0f0f0',
    textAlign : 'justify',
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  expandedContent: {
    fontStyle: 'italic',
  },
  bookImage: {
    borderRadius : 10,
    alignSelf : 'center',
    width: 150, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: 'cover', // Image resizing mode
    marginBottom: 10, // Adjust margin as needed
  },
  chapterButton: {
    backgroundColor: '#6699CC', // Background color
    color: '#f0f0f0', // Text color
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
  chapterItem: {
    backgroundColor: '#6699CC',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  chapterText: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AudioBook;


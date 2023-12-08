import React, { useState , useEffect } from 'react';
import { Button, ScrollView, Image, View, Text, StyleSheet } from 'react-native';
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
	console.log(authorName);
	const [chapterList, setChapterList] = useState([]);
	const [sound, setSound] = useState();

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
      		const response = await axios.post(`http://192.168.1.10:5000/api/receivelink`, link);
      		setChapterList(response.data)
      		console.log(response.data)
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


	return(
		<ScrollView contentContainerStyle={styles.container}>
					<Image source = {{ uri: bookimgURL}} style = {styles.bookImage} />
					<Text style={styles.bookTitle}>{bookName}-{authorName}</Text>
      		<ScrollView contentContainerStyle={styles.chapterlist}>
      		{chapterList.map((chapter, index) => (
       		 <Button title={`Chapter ${index+1}`} key={index} onPress={()=>playSound(chapter)}/>
      		))}
      		</ScrollView>
    	</ScrollView>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up all available space
    padding: 20, // Add padding around the content
    backgroundColor: '#040404', // Set a background color
  },
  chapterlist: {
    marginLeft : 5,
    marginTop: 20,
  },
  content: {
    color: '#f0f0f0',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10, // Add some bottom margin to separate the chapters
  },
  bookTitle: {
    textAlign : 'center',
    color : '#f0f0f0',
    alignSelf : 'center',
    fontSize : 20,
    fontWeight: 'bold',
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

export default AudioBook;


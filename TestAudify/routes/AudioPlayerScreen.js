import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, Button, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import Bookmark from './Bookmark.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatTime } from './utils.js';
import { AntDesign } from '@expo/vector-icons';


const AudioPlayerScreen = ({ route, navigation }) => {

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isBookmarkModalVisible, setBookmarkModalVisible] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkNote, setBookmarkNote] = useState('');

  const { chapterUrl, bookName, bookImage } = route.params;
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerStyle : { backgroundColor : '#6699CC',},
      headerTintColor : '#f0f0f0',
      headerTitleStyle : {fontWeight : 'bold',},
      headerTitle: `Now Playing: ${bookName}` ,
    });
  }, [bookName]);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [chapterUrl]);

  const updatePlaybackStatus = (status) => {
    setPositionMillis(status.positionMillis);
  };

  const loadAudio = async () => {
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: chapterUrl },
      { shouldPlay: false },
      updatePlaybackStatus
    );
    setSound(sound);
    setDurationMillis(status.durationMillis);
  };

  const playPauseAudio = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleForward = async () => {
    const newPosition = positionMillis + 10000;
    if (newPosition < durationMillis) {
      if(sound) {
        await sound.setPositionAsync(newPosition);
        setPositionMillis(newPosition);
      }
    }
  };

  //add bookmarks
  const addBookmark = () => {
    const newBookmark = {
      timestamp: positionMillis,
      note: bookmarkNote,
    };

    setBookmarks([...bookmarks, newBookmark]);
    setBookmarkNote('');
  };

  const handleBackward = async () => {
    const newPosition = positionMillis - 10000;
    if(newPosition>0){
      if(sound){
        await sound.setPositionAsync(newPosition);
        setPositionMillis(newPosition);
      }
    }
  };

  const handleSliderChange = async (value) => {
      if (sound) {
        await sound.pauseAsync();
      }
      setPositionMillis(value);
  };

  const handleSliderComplete = async(value) => {
    if (sound){
      await sound.setPositionAsync(value);
      await sound.playAsync();
    }
  };

  const handleBookmarkPress = async (timestamp) => {
  if (sound) {
    await sound.setPositionAsync(timestamp);
    setPositionMillis(timestamp);
    await sound.playAsync();
    setIsPlaying(true);
  }
};


  return (
    <View style={styles.container}>
      <Image source={{ uri: bookImage }} style={styles.bookImage} />
      <Text style={styles.bookName}>{bookName}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durationMillis}
        value={positionMillis}
        onValueChange={handleSliderChange}
        onSlidingComplete={handleSliderComplete}
        minimumTrackTintColor='#1DB954'
        maximumTrackTintColor='#777'
        thumbTintColor= '#1DB954'
      />
      <View style={styles.durationContainer}>
        <Text style={styles.durationText}>{formatTime(positionMillis)}</Text>
        <Text style={styles.durationText}>{formatTime(durationMillis)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleBackward}>
          <Image source={require('../assets/icons/white_backward_icon.png')} style={styles.controlButton}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={playPauseAudio}>
          <Image 
          source={isPlaying ? require('../assets/icons/white_pause_icon.png') : require('../assets/icons/white_play_icon.png')}
          style={styles.playPauseButton}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForward}>
          <Image source={require('../assets/icons/white_forward_icon.png')} style={styles.controlButton}/>
        </TouchableOpacity>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={()=> setSidebarOpen(!isSidebarOpen)}>
          <AntDesign name={isSidebarOpen ? 'down' : 'up'} size={24} color='#1DB954' style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> setBookmarkModalVisible(true)}>
          <AntDesign name="plus" size={24} color="#1DB954" style={styles.icon}/>
        </TouchableOpacity>
      </View>
      <Modal 
        animationType="slide"
        transparent={false}
        visible={isSidebarOpen}
        onRequestClose={()=> setSidebarOpen(false)}
      >
        <SafeAreaView style={{ flex: 1}}>
          <Bookmark bookmarks={bookmarks} onBookmarkPress={handleBookmarkPress}/>
          <Button title="Close" onPress={()=> setSidebarOpen(false)}/>
        </SafeAreaView>
      </Modal>
      <Modal 
        animationType="slide"
        transparent={false}
        visible={isBookmarkModalVisible}
        onRequestClose={()=> setBookmarkModalVisible(false)}
      >
        <SafeAreaView style={{ flex:1, backgroundColor: '#040404' }}>
          <View style={styles.bookmarkModalContainer}>
            <Text style={styles.timestampText}>
              {formatTime(positionMillis)}
            </Text>
            <TextInput
              placeholder="Add a note"
              placeholderTextColor="white"
              style={styles.bookmarkNoteInput}
              value={bookmarkNote}
              onChangeText={(text)=> setBookmarkNote(text)}
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={()=>addBookmark()}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={()=> setBookmarkModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
  header: {
    backgroundColor: '#040404',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
  },
  headerText: {
    color: '#1DB954',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  bookName: {
    color: '#f0f0f0',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    marginBottom: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  durationText: {
    color: '#f0f0f0',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  controlButton: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  bookmarkModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#040404',
  },
  timestampText: {
    fontWeight: 'bold',
    color: '#1DB954',
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    width: '48%',
    borderRadius: 5,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#777',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  bookmarkNoteInput: {
    fontWeight: 'bold',
    color: 'white',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius : 5,
    width: '80%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default AudioPlayerScreen;

// Bookmark.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { formatTime } from './utils.js';

const Bookmark = ({ bookmarks, onBookmarkPress }) => {
  return (
    <ScrollView style={styles.bookmarkContainer}>
      {bookmarks.map((bookmark, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onBookmarkPress(bookmark.timestamp)}
          style={styles.bookmarkItem}
        >
          <Text style={styles.bookmarkText}>
            {formatTime(bookmark.timestamp)}
          </Text>
          <Text style={styles.bookmarkNote}>{bookmark.note}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 200,
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookmarkContainer: {
    flex: 1,
    backgroundColor: '#040404', // Set the background color to match your application's background
    padding: 20,
  },
  bookmarkItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1DB954', // Add a border or background color to separate bookmarks
    paddingBottom: 10,
  },
  bookmarkText: {
    color: '#1DB954',
    fontSize: 16,
  },
  bookmarkNote: {
    color: '#f0f0f0',
    fontSize: 14,
  },
});

export default Bookmark;

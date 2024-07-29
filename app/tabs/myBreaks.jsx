import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'; // Import axios

const MyBreaks = () => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [notification, setNotification] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedBeach, setSelectedBeach] = useState(''); // Track which beach is selected

  const fetchSavedLocations = async () => {
    try {
      const savedLocations = await AsyncStorage.getItem('savedLocations');
      if (savedLocations) {
        setSavedLocations(JSON.parse(savedLocations));
      }
    } catch (error) {
      console.error('Failed to load saved locations', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedLocations();
    }, [])
  );

  const fetchConditionsSummary = async (beachName) => {
    try {
      const response = await axios.get(`http://192.168.0.24:8000/summary/`, {
        params: { beach_name: beachName }
      });
      setSummary(response.data.conditions);
      setSelectedBeach(beachName); // Set the selected beach to show summary for
    } catch (error) {
      console.error('Failed to fetch conditions summary', error);
      setSummary('Failed to fetch conditions summary.');
    }
  };

  const handleDelete = async (beachName) => {
    try {
      const updatedLocations = savedLocations.filter(loc => loc.beach_name !== beachName);
      await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
      setSavedLocations(updatedLocations);
      showNotification('Location removed successfully!');
    } catch (error) {
      console.error('Failed to remove location', error);
      showNotification('Failed to remove location.');
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
  };

  return (
    <ImageBackground
      source={require('@/assets/images/water2.png')}
      style={styles.backgroundImage}
      imageStyle={styles.image}
    >
      <View style={styles.container}>
        <Text style={styles.text}>My Breaks</Text>
        {notification ? (
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        ) : null}
        {summary ? (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>{`Summary for ${selectedBeach}: ${summary}`}</Text>
          </View>
        ) : null}
        {savedLocations.length > 0 ? (
          <FlatList
            data={savedLocations}
            keyExtractor={(item) => item.beach_name}
            renderItem={({ item }) => (
              <View style={styles.locationItem}>
                <Text style={styles.locationText}>{item.beach_name}</Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => fetchConditionsSummary(item.beach_name)}
                >
                  <Text style={styles.detailsButtonText}>Show Summary</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.beach_name)}
                >
                  <Text style={styles.deleteButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noLocationsText}>No saved locations</Text>
        )}
      </View>
    </ImageBackground>
  );
};

export default MyBreaks;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 20,
    alignSelf: 'center',
  },
  locationItem: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#e0f7fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff5722',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noLocationsText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
  },
  notificationContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffeb3b',
    borderRadius: 8,
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 16,
    color: '#000000',
  },
  summaryContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#b2ff59',
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#000000',
  },
});


//`http://192.168.1.91:8000/summary/?beach_name=${encodeURIComponent(beachName)}
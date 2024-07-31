import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ImageBackground,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const MyBreaks = () => {
  const [savedLocations, setSavedLocations] = useState([]); //hook to initialize saved locations to an empty array
  const [locationSummaries, setLocationSummaries] = useState({}); //hook to initialize the summaries to an empty object

  useEffect(() => {
  const fetchSavedLocations = async () => { //fetching saved locations from Async storage 
    try {
      const savedLocations = await AsyncStorage.getItem('savedLocations'); //savedLocations coming from the home screen component, stored in React Native Async storage
      if (savedLocations) {
        const locations = JSON.parse(savedLocations); 
        setSavedLocations(locations);

        const summaries = {}; //initializing an empty object to store the conditions summary
        for (const location of locations) {
          const response = await axios.get(`http://192.168.0.24:8000/summary/?beach_name=${encodeURIComponent(location.beach_name)}`); // GET request to Django
          summaries[location.beach_name] = response.data.conditions;
        }
        setLocationSummaries(summaries);
      }
    } catch (error) {
      console.error('Failed to get summary', error); //error log to console, should do more error checks 
    }
  };
      fetchSavedLocations(); 
    }, []);

  const removeFromSaved= async (beachName) => { //a function so that a user can remove a beach from their saved beaches
    try {
      const updatedLocations = savedLocations.filter(loc => loc.beach_name !== beachName);
      await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
      setSavedLocations(updatedLocations);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/water2.png')}
      style={styles.backgroundImage}
      imageStyle={styles.image}
    >
      <View style={styles.container}>
        <Text style={styles.text}>My Breaks</Text>
        <Text style={styles.yourBeachesText}>Summary of your favourite beaches surf for today:</Text>
        {savedLocations.length > 0 ? (
          <FlatList
            data={savedLocations}
            keyExtractor={(item) => item.beach_name}
            renderItem={({ item }) => (
              <View style={styles.locationItem}>
                <Text style={styles.locationText}>{item.beach_name}</Text>
                {locationSummaries[item.beach_name] && (
                  <Text style={styles.summaryText}>{locationSummaries[item.beach_name]}</Text>
                )}
                <TouchableOpacity onPress={() => removeFromSaved(item.beach_name)}>
                  <Text style={styles.removeText}>Remove from saved</Text>
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
    color: 'white',
    marginBottom: 20,
    alignSelf: 'center',
  },
  yourBeachesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    alignSelf: 'center',
  },

  locationItem: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#e0f7fa',
  },
  locationText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },

  summaryText: {
    fontSize: 16,
    color: '#000000',
    fontWeight:'bold',
   
  },
  removeText: {
    fontSize: 16,
    color: '#black',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  noLocationsText: {
    fontSize: 18,
    color: '#white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MyBreaks;


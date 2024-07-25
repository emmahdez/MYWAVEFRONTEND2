import { StyleSheet, Text, View, TextInput,ActionSheetIOS,Button,ImageBackground} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
;

const Map = () => { // Map component
  const [locations, setLocations] = useState([]); // Hook to store location data from Django API
  const [searchMap, setSearchMap] = useState(''); // Hook to store user search
  const [filter, setFilter] = useState(''); // Hook to store beach type filter

  useEffect(() => { // useEffect to fetch locations from API
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://192.168.1.91:8000/locations/'); // GET request to Django
        setLocations(response.data); // Set the locations to be the fetched data
      } catch (error) {
        console.error(error); // Error console log
      }
    };
    fetchLocations();
  }, []);

  // Filter locations based on search input and selected filter
  const filteredBeaches = locations.filter(location => {
    const matchesSearchMap = location.beach_name.toLowerCase().includes(searchMap.toLowerCase());
    const matchesFilter = filter === '' || location.beach_type === filter;
    return matchesSearchMap && matchesFilter;
  });

   // Function to show ActionSheetIOS
   const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'Select a beach type',
        options: ['All Beach Types', 'Sandy', 'Reef break', 'Cancel'],
        cancelButtonIndex: 3, 
      },
      (buttonIndex) => {
        // Handle the selection
        const filterOptions = ['', 'Sandy', 'Reef break'];
        if (buttonIndex !== 3) { // Exclude cancel option
          setFilter(filterOptions[buttonIndex]);
        }
      }
    );
  };

 
  return (
    <View style={styles.container}>
       <ImageBackground
        source={require('@/assets/images/water.png')}
        style={styles.inputContainer}
        >
        <TextInput
          style={styles.search}
          placeholder='Search beach on map...'
          value={searchMap}
          onChangeText={setSearchMap}
        />
        <Button title="Filter by beach type" onPress={showActionSheet} />
      </ImageBackground>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          showsUserLocation={true} // React Native Maps functionality, shows user's current location
          provider={MapView.PROVIDER_DEFAULT} // Provider default is Apple Maps
        >
          {filteredBeaches.map(location => (
            <Marker // Creating custom markers from Django location data
              key={location.beach_name} // The beach name is the key
              coordinate={{
                latitude: parseFloat(location.latitude), // Lat and long coordinates where the marker will be placed from location data
                longitude: parseFloat(location.longitude),
              }}
              title={location.beach_name} // Shows only the beach name
              description={`Beach Type: ${location.beach_type}`} // Shows the beach type
            />
          ))}
        </MapView>
      </View>
    </View>
  );
}

export default Map;

// All the styles for the map component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    position: 'absolute', 
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#aad3f2',
    zIndex: 1, 
    elevation: 4, 
    alignItems: 'center',
    paddingTop:40,
    

  },
  search: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white', 
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
import { StyleSheet, Text, View, TextInput,ActionSheetIOS,Button,ImageBackground} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
;

const Map = () => { // Map component
  const [locations, setLocations] = useState([]); // Hook to initialize empty array to hold location data
  const [searchMap, setSearchMap] = useState(''); // Hook to initialize empty string for a user search
  const [filter, setFilter] = useState(''); // Hook to initialize an empty string for filtering 

  useEffect(() => { // useEffect to fetch locations from django
    const fetchLocations = async () => {
        const response = await axios.get('http://192.168.0.24:8000/locations/'); // GET request to Django
        setLocations(response.data); // Set the locations to be the fetched data
    };
    fetchLocations();
  }, []);

  // Filter locations based on search input and filters out the markers according to what the user is inputting in the search string
  const filteredBeaches = locations.filter(location => { //a filtering function for the user search bar 
    const matchesSearchMap = location.beach_name.toLowerCase().includes(searchMap.toLowerCase()); //case insensitive
    const matchesFilter = filter === '' || location.beach_type === filter; 
    return matchesSearchMap && matchesFilter; //returns user input
  });

   // React native ActionSheetIOS to filter the markers, tried using Picker but I couldnt get it to function, Picker would be better
   const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'Select a beach type',
        options: ['All Beach Types', 'Sandy', 'Reef break', 'Cancel'],
        cancelButtonIndex: 3, //indexing starts at 0
      },
      (buttonIndex) => { //index of selected option
        const filterOptions = ['', 'Sandy', 'Reef break']; //emtpy string for placeholder of default which is "All beach types"
        if (buttonIndex !== 3) {  //if the user doesnt select the cancel button
          setFilter(filterOptions[buttonIndex]); //the filter is set to whichever option user selected
        }
      }
    );
  };

 
  return (
    <View style={styles.container}>
       <ImageBackground
        source={require('@/assets/images/water2.png')}
        style={styles.inputContainer}
        >
        <TextInput
          style={styles.search}
          placeholder='Search beach on map...'
          value={searchMap}
          onChangeText={setSearchMap}
        /> 
        <Button title="Filter by beach type" onPress={showActionSheet}  /> 
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
              title={location.beach_name} // Shows the beach name
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


//should have done more error checks
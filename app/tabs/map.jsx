import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import React, { useState, useEffect} from 'react';
import axios from 'axios';


const Map = () => { //map component
  const [locations,setLocations] = useState([]); //hook to store location data from django api

  useEffect( () => { //useEffect to...
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://192.168.1.91:8000/locations/'); //GET request to Django
        setLocations(response.data); //set the locations to be the fetched data
      } catch(error) {
        console.error(error); //error console log
      }
    };
    fetchLocations();
  }, []);

return (
  <View style={styles.container}>
    <MapView
      style={styles.map} 
      showsUserLocation={true} //react-native-maps functionality, shows users current location
      provider={MapView.PROVIDER_DEFAULT} //provider default is apple maps
    >
      {locations.map(location => (
          <Marker //creating custom markers from django location data
            key={location.beach_name} //the beach name is the key
            coordinate={{
              latitude: parseFloat(location.latitude), // lat and long coordinates where the marker will be placed from location data
              longitude: parseFloat(location.longitude),
            }}
            title={location.beach_name} //shows only the beach name
          />
        ))}
    </MapView>
  </View>
);
}

export default Map;
//all the styles for the map component
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
});
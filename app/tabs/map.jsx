import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import React, { useState, useEffect} from 'react';
import axios from 'axios';


const Map = () => {
  const [locations,setLocations] = useState([]);

  useEffect( () => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://192.168.1.91:8000/locations/');
        setLocations(response.data);
      } catch(error) {
        console.error(error);
      }
    };
    fetchLocations();
  }, []);

return (
  <View style={styles.container}>
    <MapView
      style={styles.map}
      showsUserLocation={true}
      provider={MapView.PROVIDER_DEFAULT}
    >
      {locations.map(location => (
          <Marker
            key={location.beach_name}
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            title={location.beach_name}
          />
        ))}
    </MapView>
  </View>
);
}

export default Map;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
});
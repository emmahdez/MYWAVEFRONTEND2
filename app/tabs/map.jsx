import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import React from 'react'

const Map = () => {

return (
  <View style={styles.container}>
    <MapView
      style={styles.map}
      showsUserLocation={true}
      provider={MapView.PROVIDER_DEFAULT}
    >
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
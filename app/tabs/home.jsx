import React, {useState, useEffect}from 'react';
import { StyleSheet, Text, View , FlatList,TextInput,ActivityIndicator,Pressable,ScrollView,Image,TouchableOpacity} from 'react-native'
import axios from 'axios'; 

const Home = () => {
  const[locations,setLocations] = useState([]); //location hook
  const[search, setSearch] = useState(''); //search filter hook
  const[returnedLocations, setReturnedLocations] = useState([]); //hook for location via search 
  const[locationSelected, setLocationSelected] = useState(null); //hook for pressable location
  
  useEffect(() => {
    const fetchLocations = async () => {
      try{
        const locationApi = await axios.get('http://192.168.1.91:8000/locations/');
        console.log(locationApi.data);
        setLocations(locationApi.data);
        setReturnedLocations(locationApi.data)
      } catch (error) {
        console.error(error);
      }
    };
   fetchLocations();
  }, []);

  const manageSearch = (userSearch) => {
    setSearch(userSearch);
    const response = locations.filter(item =>
      item.beach_name.toLowerCase().includes(userSearch.toLowerCase())

    ); setReturnedLocations(response);
  };

  const handlePress = (location) => {
    if (locationSelected && locationSelected.beach_name === location.beach_name) {
      setLocationSelected(null);
    } else {
      setLocationSelected(location);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Search for a break</Text>
      <TextInput
        style={styles.searchBar}
        placeholder='Type beach name...'
        value={search}
        onChangeText={manageSearch}
      />
      <FlatList
        data={returnedLocations}
        keyExtractor={(item) => item.beach_name} 
        renderItem={({ item }) => (
          <View>
          <Pressable
            onPress={() => handlePress(item)}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? '#aad3f2' : '#cce7ff',
              },
              styles.locationItem,
            ]}
          >
            <Text style={styles.locationText}>{item.beach_name}</Text>
          </Pressable>
          {locationSelected && locationSelected.beach_name === item.beach_name && (
            <View style={styles.descriptionContainer}>
              <Image
                source={require('@/assets/images/pease-bay-leisure-park.jpg')}
                style={styles.peaseBay}
              />
              <Text style={styles.descriptionText}>{locationSelected.description}</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  locationItem: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    color: '#000000',
  },
  descriptionContainer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#000000',
  },
  peaseBay: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
});
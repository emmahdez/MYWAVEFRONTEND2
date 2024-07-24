import React, {useState, useEffect}from 'react';
import { StyleSheet, Text, View , FlatList,TextInput,ActivityIndicator,Pressable,ScrollView,Image,TouchableOpacity} from 'react-native'
import axios from 'axios'; 

const Home = () => {  //Home screen component
  const[locations,setLocations] = useState([]); // hook to store fetched location data from server
  const[search, setSearch] = useState(''); //search filter hook that stores user inputed string 
  const[returnedLocations, setReturnedLocations] = useState([]); //hook to store the search location which matches user input
  const[locationSelected, setLocationSelected] = useState(null); //hook to store the selected location
  
  useEffect(() => { //useEffect to render location data
    const fetchLocations = async () => {
      try{
        const locationApi = await axios.get('http://192.168.1.91:8000/locations/'); //GET request to Django REST
        console.log(locationApi.data);
        setLocations(locationApi.data); //set locations as the returned data
        setReturnedLocations(locationApi.data) //set returned locations to returned data 
      } catch (error) {
        console.error(error); // console error log 
      }
    };
   fetchLocations(); //call the to the fetchLocation function
  }, []);

  const manageSearch = (userSearch) => { //function that deals with user input of search bar 
    setSearch(userSearch); //make search state the user input
    const response = locations.filter(item =>  //search filter response
      item.beach_name.toLowerCase().includes(userSearch.toLowerCase()) //toLowerCase makes it case insensitive

    ); setReturnedLocations(response); //make retuned location state the response of the users search 
  };

  const handlePress = (location) => { //function that deals with a user selecting a location by pressing on it 
    if (locationSelected && locationSelected.beach_name === location.beach_name) { //conditions if user has selected location item
      setLocationSelected(null); //null to deselect location if conditions above hold
    } else {
      setLocationSelected(location); //set the user selected location
    } 
  };

  
  return (  //returns what user is able to see/interact with
    <View style={styles.container}>
      <Text style={styles.welcome}>Search for a break</Text>
      <TextInput
        style={styles.searchBar} 
        placeholder='Type beach name...'
        value={search}  //input value of search state 
        onChangeText={manageSearch} //call to search function with user input
      />
      <FlatList
        data={returnedLocations} // returned location upon search 
        keyExtractor={(item) => item.beach_name} //beach_name is the unique key for location items
        renderItem={({ item }) => (
          <View>
          <Pressable
            onPress={() => handlePress(item)} //minor changes when user presses location item
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? '#aad3f2' : '#cce7ff', //background colour of item changes upon press
              },
              styles.locationItem, //location item styles 
            ]}
          >
            <Text style={styles.locationText}>{item.beach_name}</Text> 
          </Pressable>  
          {locationSelected && locationSelected.beach_name === item.beach_name && ( 
            <View style={styles.descriptionContainer}> 
              <Image
                source={require('@/assets/images/pease-bay-leisure-park.jpg')} //image of location, would have to add these seperately to a database somehow, not unique to each location
                style={styles.peaseBay} //image styles
              />
              <Text style={styles.descriptionText}>{locationSelected.description}</Text>
              </View> //display of image with description
            )}
          </View>
        )}
      />
    </View>
  );
};

export default Home;

// all the styles for the home component
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
    fontWeight:'bold'
  },
  descriptionContainer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    fontStyle:'italic',
    marginTop:16
  },
  peaseBay: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
});
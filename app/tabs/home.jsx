import React, {useState, useEffect}from 'react';
import { StyleSheet, Text, View , FlatList,TextInput,ActivityIndicator,Pressable,ScrollView,Image,TouchableOpacity} from 'react-native'
import axios from 'axios'; 

const convertWindDirection = (degrees) => { //a function to convert the surf data wind direction field to cardinal units (i.e N,E,S,W etc...)
if (degrees >= 337.5 || degrees < 22.5) return 'N';
if (degrees >= 22.5 && degrees < 67.5) return 'NE';
if (degrees >= 67.5 && degrees < 112.5) return 'E';
if (degrees >= 112.5 && degrees < 157.5) return 'SE';
if (degrees >= 157.5 && degrees < 202.5) return 'S';
if (degrees >= 202.5 && degrees < 247.5) return 'SW';
if (degrees >= 247.5 && degrees < 292.5) return 'W';
if (degrees >= 292.5 && degrees < 337.5) return 'NW';
return 'Unknown'; // if degrees is out of range
};


const Home = () => {  //Home screen component
  const[locations,setLocations] = useState([]); // hook to store fetched location data from server
  const[search, setSearch] = useState(''); //search filter hook that stores user inputed string 
  const[returnedLocations, setReturnedLocations] = useState([]); //hook to store the search location which matches user input
  const[locationSelected, setLocationSelected] = useState(null); //hook to store the selected location
  const[surfConditions, setSurfConditions] = useState(null); //hook to store fetched surf data from the server
  const[surfDisplay, setSurfDisplay] = useState(false); //hook to display the surf data, set default to false
  
  useEffect(() => { //useEffect to...
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

  const fetchSurfConditions = async (beachName) => {
    try {
      const response = await axios.get(`http://192.168.1.91:8000/forecast/?beach_name=${encodeURIComponent(beachName)}`); //GET request to Django rest
      setSurfConditions(response.data.data.hours); //returns hourly data 
    } catch (error) {
      console.error(error); //console error log
    }
  };

  const handlePress = (location) => { //function that deals with a user selecting a location by pressing on it 
    if (locationSelected && locationSelected.beach_name === location.beach_name) { //conditions if user has selected location item
      
      setLocationSelected(null); //null to deselect location if conditions above hold
      setSurfDisplay(false); 
    } else {
      setLocationSelected(location); //set the user selected location
      fetchSurfConditions(location.beach_name); //fetch the surf data based off beach name on press
      setSurfDisplay(false);
    } 
  };
const handleSurfDisplay = () => {
  setSurfDisplay(!surfDisplay); //display the surf data, make not false so it shows onpress below
}
  

  
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
              <TouchableOpacity // button that user can press to see surf data
                  style={styles.surfDisplayButton} //styling for the button
                  onPress={handleSurfDisplay} //call to surf data display function
                >
                  <Text style={styles.surfDisplayButtonText}>
                    See todays surf!
                  </Text> 
                </TouchableOpacity>
                {/* presenting the surf data to user once the button is triggered*/}
                {surfDisplay && surfConditions && {/*if both of these are true the view is triggered */}(
                  <ScrollView horizontal style={styles.surfConditionsContainer}> 
                  {/* loop through each condition in the array, as it is recorded hourly,stored as index and render in the view*/}
                    {surfConditions.map((condition, index) => ( 
                      <View key={index} style={styles.conditionItem}>
                        <Text style={styles.conditionText}>
                          Time: {new Date(condition.time).toLocaleTimeString()}
                        </Text>
                        <Text style={styles.conditionText}>
                          Wave Height: {condition.waveHeight.sg} metres
                        </Text>
                        <Text style={styles.conditionText}>
                          Period: {condition.wavePeriod.sg} seconds
                        </Text>
                        <Text style={styles.conditionText}>
                          Wave Direction: {condition.waveDirection.sg} degrees
                        </Text>
                        <Text style={styles.conditionText}>
                          Wind Speed: {condition.windSpeed.sg} mph
                        </Text>
                        <Text style={styles.conditionText}>
                          Wind Direction: {convertWindDirection(condition.windDirection.sg)} 
                        </Text> 
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View> 
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

  surfDisplayButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    position:'absolute',
    top:60,
    right:10
    
  },
  surfDisplayButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  surfConditionsContainer: {
    marginTop: 16,
    paddingVertical: 10,
  },
  conditionItem: {
    marginRight: 16,
    width: 300, 
  },
  conditionText: {
    fontSize: 14,
    color: '#000000',
    marginVertical: 4,
  },
});
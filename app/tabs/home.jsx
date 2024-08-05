import React, {useState, useEffect}from 'react';
import { StyleSheet, Text, View , FlatList,TextInput,ActivityIndicator,Pressable,ScrollView,Image,TouchableOpacity,ImageBackground} from 'react-native';
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * a function to convert the surf data 
 * wind direction field to cardinal (i.e N,E,S,W etc...)
 * @param {number} degrees -wind direction in degrees by default
 * @returns {string} - convert to cardinal
 */



const convertWindDirection = (degrees) => { 
if (degrees >= 350 || degrees <= 10) return 'N';
if (degrees >= 20 && degrees <= 30) return 'N/NE';
if (degrees >= 40 && degrees <= 50) return 'NE';
if (degrees >= 60 && degrees <= 70) return 'E/NE';
if (degrees >= 80 && degrees <= 100) return 'E';
if (degrees >= 110 && degrees <= 120) return 'E/SE';
if (degrees >= 130 && degrees <= 140) return 'SE';
if (degrees >= 150 && degrees <= 160) return 'S/SE';
if (degrees >= 170 && degrees <= 190) return 'S';
if (degrees >= 200 && degrees <= 210) return 'S/SW';
if (degrees >= 220 && degrees <= 230) return 'SW';
if (degrees >= 240 && degrees <= 250) return 'W/SW';
if (degrees >= 260 && degrees <= 280) return 'W';
if (degrees >= 290 && degrees <=300) return 'W/NW';
if (degrees >= 310 && degrees <= 320) return 'NW';
if (degrees >= 330 && degrees <= 340) return 'NE';
else return 'Unknown'; // if degrees is out of range
};

/**
 * Home Screen component
 * @component
 * @returns {JSX.Element}
 */
const Home = () => {  //Home screen component
  const[locations,setLocations] = useState([]); // useState hook to initialize an empty array, to then store fetched location data from useEffect 
  const[search, setSearch] = useState(''); // hook to initialize an empty string, to then store user inputed string in the search bar 
  const[returnedLocations, setReturnedLocations] = useState([]); //hook to initialize an empty array of returned locations that a user searches for, (naming convention)
  const[locationSelected, setLocationSelected] = useState(null); //hook to initialize a null value for a user selected beach i.e it defaults to no location being selected
  const[surfConditions, setSurfConditions] = useState(null); //hook to initialize null value for a user selecting to view the surf conditions, (should re-consider naming convention)
  const[surfDisplay, setSurfDisplay] = useState(false); //hook to initialize the surf forecast display container to false, i.e defaulted to not be fetched until prompted by a user
  
  useEffect(() => { //useEffect to fetch location data from Django backend
    const fetchLocations = async () => {
      try{
        const locationApi = await axios.get('http://192.168.1.91:8000/locations/'); //GET request to Django
        setLocations(locationApi.data); //set locations state as ALL the returned data
        setReturnedLocations(locationApi.data); //set returned locations state (via user search )as the returned data 
    } catch (error) {
      console.error(error); //log error to the console 
    }
  };

  fetchLocations(); //call the to the fetchLocation function to run async operation
  }, []); // empty dependency array, ensures useEffect runs once

/**
 * function that deals with user input of search bar 
 * @param {string} userSearch 
 */
  const manageSearch = (userSearch) => { 
    try{
    setSearch(userSearch); //make search state the user input
    const response = locations.filter(item =>  //search filter response
      item.beach_name.toLowerCase().includes(userSearch.toLowerCase()) //toLowerCase makes it case insensitive

    ); setReturnedLocations(response); //make returned location state the response of the users search 
  }  catch(error) {
    console.error(error);
  }
  };

  /**
   * Function to get the surf conditions for a selected beach
   * @param {string} beachName 
   */
  const fetchSurfConditions = async (beachName) => {
    try{
      const response = await axios.get(`http://192.168.1.91:8000/forecast/?beach_name=${encodeURIComponent(beachName)}`); //GET request to Django
      setSurfConditions(response.data.data.hours); //nested data to return hourly data 
    } catch(error) {
      console.error(error);
    }
  };

  /**
   * function that deals with a user 
   * selecting a location by pressing on it 
   * @param {Object} location 
   */
  const handlePress = (location) => { 
    try{
    if (locationSelected && locationSelected.beach_name === location.beach_name) { // if location selected is true (which is defaulted to false) and the location item is equal to the user selected location (defaulted to null))
      
      setLocationSelected(null); //null to deselect location if conditions above hold
      setSurfDisplay(false);  // surf data isnt displayed yet
    } else {
      setLocationSelected(location); //set the user selected location
      fetchSurfConditions(location.beach_name); //fetch the surf data based off beach name on press
      setSurfDisplay(false); //surf data still not displayed until prompted by user
    } 
  }catch(error) {
    console.error(error)
  }
};


const handleSurfDisplay = () => {
  try {
    setSurfDisplay(!surfDisplay);  //display the surf data, make not false so it shows onpress below in return
  } catch (error) {
    console.error(error);
  }
};


/**
 * function so that users can save 
 * spots on their device locally using AsyncStorage
 * @param {Object} location 
 */
const saveLocation = async (location) => { 
  try{
    const savedLocations = await AsyncStorage.getItem('savedLocations'); //retrieve saved locations from local storage
    const parsedLocations = JSON.parse(savedLocations); // parse json data after retrieval because Async storage can only directly store strings of data
      if (!parsedLocations.some(loc => loc.beach_name === location.beach_name)) // check that the location hasnt already been saved 
       {
        parsedLocations.push(location); //adding the new location to the array if the above holds
        await AsyncStorage.setItem('savedLocations', JSON.stringify(parsedLocations)); //back into a json string
        alert('Beach saved to MyBreaks!'); //notification
      } else {
        alert('Already saved to MyBreaks');
      }
    } catch(error) {
      console.error(error);
    }
};
  
  return (  //returns what user is able to see and interact with
    <ImageBackground
      source={require('@/assets/images/water2.png')} 
      style={styles.backgroundImage}
      imageStyle={styles.image}
    >
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
          { locationSelected && locationSelected.beach_name === item.beach_name &&  ( //if there is no location selected and then the user clicks on the location item
            <View style={styles.descriptionContainer}> 
              <Image
                source={require('@/assets/images/wave.jpg')} //same image for every location, would have liked to added images of each beach 
                style={styles.peaseBay} //image styles
              />

              <Text style={styles.descriptionText}>{locationSelected.description}</Text> 
              <TouchableOpacity
                    style={styles.saveButton} 
                    onPress={() => saveLocation(locationSelected)} // call save location button function
                  > 
                    <Text style={styles.saveButtonText}>Save Location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                        // button that user can press to see surf data
                  style={styles.surfDisplayButton}
                  onPress={handleSurfDisplay} //call to surf data display function
                >
    
                  <Text style={styles.surfDisplayButtonText}> 
                    See todays surf! 
                  </Text> 
                </TouchableOpacity> 
                {surfDisplay && surfConditions && ( //all the surf forecasting information, rendered if not already displayed
                  <ScrollView horizontal style={styles.surfConditionsContainer}> 
                    {surfConditions.map((condition, index) => ( //react native map function for each condition reading (per hour) iterated over by index
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
    </ImageBackground>
  );
};

export default Home;


// all the styles for the home component

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
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom:20,
    alignSelf:'center',

  },
  searchBar: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor:'white'
  },
  locationItem: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    backgroundColor:'#e0f7fa'
  },
  locationText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
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
    fontStyle: 'italic',
    marginTop: 16,
  },
  peaseBay: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    position:'absolute',
    top: 120,
    right:15,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  surfDisplayButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    position: 'absolute',
    top: 30,
    right: 10,
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

//should have done more error checks
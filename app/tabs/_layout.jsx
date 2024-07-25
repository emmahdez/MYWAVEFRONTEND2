import { StyleSheet,Text,View } from "react-native"
import {Tabs, Redirect} from 'expo-router';
import HomeScreen from "./home";

const TabsLayout = () => {
    return (
        <>
          <Tabs options={{ headerShown: false}}>
            <Tabs.Screen
                name="home"
                options= {{headerShown:false}}
                />
                <Tabs.Screen
                name="map"
                options= {{headerShown:false}}
                />
                <Tabs.Screen
                name="myBreaks"
                options= {{headerShown:false}}
                />
            </Tabs>
         </>
    )
}

export default TabsLayout
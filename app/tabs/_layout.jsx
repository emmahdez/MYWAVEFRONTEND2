import { StyleSheet,Text,View } from "react-native"
import {Tabs, Redirect} from 'expo-router';
import HomeScreen from "./home";

const TabsLayout = () => {
    return (
        <>
          <Tabs>
            <Tabs.Screen
                name="home"
                />
            </Tabs>
         </>
    )
}

export default TabsLayout
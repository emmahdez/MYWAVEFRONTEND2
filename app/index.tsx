
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/wavey.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to MyWave!</Text>
        <Text style={styles.description}>24hr surf forecasts for the best spots in Scotland</Text>
        <StatusBar style="auto" />
        <Link href= "../tabs/home" style={styles.link}>Press here to explore</Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },

  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    
  },
  link: {
    color: 'blue',
    marginTop: 16, 
  },
});
import React from 'react';
import {StyleSheet, View, Text, Image } from 'react-native';
import Button from 'react-native-button'

export default HomeScreen = ({navigation}) => {
    return (
      <View>
        <Text style={styles.title}>Welcome to PathTracker</Text>
        <Text style={styles.introText}>This app allows you to track your walking path and let's you know when you go off route</Text>
        {/* Displaying image on homepage */}
        <Image source = {{uri:'https://kidseropuit.nl/wp-content/uploads/2019/09/wandelroutes-op-de-veluwe-posbank.jpg'}} style={{ width: '100%', height: 300 }} />
        <View style={styles.buttons}>
          {/* Navigational buttons */}
          <Button style={styles.mapButton} onPress={() => navigation.navigate('Map')}>
            Open the map!
          </Button>
          <Button style={styles.weatherButton} onPress={() => navigation.navigate('Weather')}>
            Check the weather
          </Button>
        </View>
        <Button style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
          Settings
        </Button>
      </View>
    )
  }

// Style component with all the styling of this screen
const styles = StyleSheet.create({
title: {
  fontSize: 30,
  textAlign: "center",
  marginTop: 16,
},
introText: {
  fontSize: 15,
  textAlign: "center",
  marginTop: 5,
  marginBottom: 5,
  width: '80%',
  marginLeft: 'auto',
  marginRight: 'auto'
},
buttons: {
  marginTop: 10,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row'
},
mapButton: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 27,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: 'blue',
  color: 'white',
  marginRight: 5
},
weatherButton: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 12,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: 'blue',
  color: 'white',
  marginLeft: 5
},
settingsButton: {
  paddingVertical: 12,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: 'gray',
  color: 'white',
  marginTop: 80,
  width: '50%',
  marginLeft: 'auto',
  marginRight: 'auto'
}
});

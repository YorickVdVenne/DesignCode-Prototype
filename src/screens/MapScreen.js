import React, {useEffect, useState} from 'react';
import {StyleSheet, View } from 'react-native';
import Button from 'react-native-button'

import MapView, {PROVIDER_GOOGLE, Marker, Polygon} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeoFencing from 'react-native-geo-fencing'; 

export default MapScreen = () => {
  // All the states used for saving dynamic data
  const [currentLocation, setCurrentLocation] = useState({lat: 52.127817, lng: 4.336369});
  const [previousLocation, setPreviousLocation] = useState(null);
  const [isEnter, setIsEnter] = useState(true);
  const [hasPreviousLocation, setHasPreviousLocation] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState(retrievePreference());

  //function that retrieves the stored preference for notification from localstorage(true or false)
  async function retrievePreference() {
    try {
        // using AsyncStorage to get locally stored item
        const jsonValue = await AsyncStorage.getItem('pref');
        const res = jsonValue != null ? JSON.parse(jsonValue) : false;
        setNotificationPreference(res)
    } catch(e) {
        console.warn(e)
    }
  }

  //function that executes when the currentlocation state changes (when user moves)
  useEffect(() => {
    // Using Geolocation library to get the current position of the user
    Geolocation.getCurrentPosition(
      (pos) => {
        if(pos.coords.latitude !== currentLocation.lat || pos.coords.longitude !== currentLocation.lng) {
          // Storing the new location in the currentlocation state
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })
        }
      },
      (err) => {
        console.log(err.code, err.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    // executing GeoFencing function to check if new location is on or off the path
    checkGeoFencing();
  }, [currentLocation])

  useEffect(() => {
    // Pushnotification configure settings
    PushNotification.configure({
      onRegister: function (token) {
      console.log("TOKEN:", token);
      },
      onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      },
      onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
      },
      onRegistrationError: function(err) {
      console.error(err.message, err);
      },
      permissions: {
      alert: true,
      badge: true,
      sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    
    //Create channel for pushnotifications to use
    PushNotification.createChannel({
      channelId: "channel-id", // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications",
    });
  }, [])

  sendMessage = (message) => {
      //Sending a local notification
      PushNotification.localNotification({
        channelId: "channel-id", 
        message: message, // (required)
      });
    }
  
  // function that checks if the users location is on or off the path, if off send notification
  checkGeoFencing = () => {
    // Create data for polygon
    const polygon = [
      { lat: 52.127817, lng: 4.336369 },
      { lat: 52.132933, lng: 4.333433 },
      { lat: 52.130614, lng: 4.333954 },
      { lat: 52.127817, lng: 4.336369 },
    ];

    const location = {
        lat: currentLocation.lat,
        lng: currentLocation.lng
    }

    // Calculating if location is inside the polygon
    GeoFencing.containsLocation(location, polygon)
      .then(() => console.log('Je bevindt je nog op het pad, ga zo door!'), setIsEnter(true))
      .catch(() => notificationPreference === true 
        // Based on notification preferences send or not send notification
        ? sendMessage('Je loopt van het pad af! Ga heel snel terug! :(') 
        : console.log('Je loopt van het pad af! Ga heel snel terug! :('), setIsEnter(false))
  }
  
  // Saving location to local phone storage using AsyncStorage
  storeData = async () => {
    try {
      console.log('Storing location...')
      const jsonValue = JSON.stringify(currentLocation)
      await AsyncStorage.setItem('location', jsonValue)
      alert('Location Stored!')
    } catch (e) {
      console.warn(e)   
    }
  }
  
  // Getting location from local phone storage (if it has one)
  getData = async () => {
    try {
      console.log('Getting previous location...')
      const jsonValue = await AsyncStorage.getItem('location')
      setPreviousLocation(jsonValue != null ? JSON.parse(jsonValue) : null)
      setHasPreviousLocation(true)
      console.log('Got previous location!')
    } catch(e) {
      console.warn(e)
    }
  }

  // Polygon to be displayed on Google maps
  const polygon = [
      {'latitude': 52.127817, 'longitude': 4.336369,},
      {'latitude': 52.132933, 'longitude': 4.333433,},
      {'latitude': 52.130614, 'longitude': 4.333954,},
      {'latitude': 52.127817, 'longitude': 4.336369,}
  ]

  return (
    <View>
      {/* Displaying Google maps */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 52.127817,
          longitude: 4.336369,
          latitudeDelta: 0.009, 
          longitudeDelta: 0.015,
        }}>
        {/* On the map: */}
        <Polygon coordinates={polygon} strokeWidth={2} strokeColor={'red'}/>
        <Marker title={'Current location'} coordinate={{ latitude : currentLocation.lat, longitude : currentLocation.lng }} />
        {hasPreviousLocation ? <Marker title={'Saved location'} coordinate={{ latitude : previousLocation.lat , longitude : previousLocation.lng }} /> : null}
      </MapView>
      <Button style={styles.routeButton} onPress={() => onPressHandler()}>Start route</Button>
      <View style={styles.content}>
        <Button style={styles.saveButton} onPress={() => storeData()}>Save location</Button>
        <Button style={styles.loadButton} onPress={() => getData()}>Load location</Button>
      </View>
    </View>
  )
}

// Style component with all the styling of this screen
const styles = StyleSheet.create({
map: {
    height: '81%'
},
content: {  
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
}, 
routeButton: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 12,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: 'green',
  color: 'white',
  marginBottom: 5
},
saveButton: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: 'blue',
  color: 'white',
  marginRight: 45
},
loadButton: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: 'blue',
  color: 'white',
}
});
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid, AppState } from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker, Polygon} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeoFencing from 'react-native-geo-fencing';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
        currentLocation: {lat: 52.127817, lng: 4.336369},
        nextLocation: {lat: 52.128053, lng: 4.333560},
        previousLocation: null,
        isEnter: true,
        hasPreviousLocation: false,
        appState: AppState.currentState    
      }

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
    PushNotification.createChannel(
      {
        channelId: "channel-id", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications",
      },
    );
  }

  componentDidMount() {
    this.requestLocationPermission()

    // See if AppState changes and if so run function
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    // See if AppState changes and if so run function
    AppState.removeEventListener("change", this._handleAppStateChange);

    // if App is in the background it will schedule an notification
    console.warn('I Unmounted!')
    if(this.state.appState === 'background') {
      PushNotification.localNotificationSchedule({
        channelId: "channel-id",
        message: "Niet vergeten om op het pad te blijven he!", // (required)
        date: new Date(Date.now() + (5 * 1000)), // in 5 secs
      });
    }
  }

  // If appstate changes it will safe new appstate in the state
  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }
    this.setState({ appState: nextAppState });
  };

  // Requesting permission to use location
  requestLocationPermission = async () => {
    if (Platform.OS !=='android' )   
    Geolocation.requestAuthorization()
    else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Can I please use your location? :)",
            message:
              "I need access!" +
              "So I know where you are ;)",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location");
        } else {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  

  sendMessage = (message) => {
    //Sending a local notification
    PushNotification.localNotification({
      channelId: "channel-id", 
      message: message, // (required)
    });
  }

  checkGeoFencing = () => {
    // Create data for polygon
    const polygon = [
      { lat: 52.127817, lng: 4.336369 },
      { lat: 52.132933, lng: 4.333433 },
      { lat: 52.130614, lng: 4.333954 },
      { lat: 52.127817, lng: 4.336369 },
    ];

    // Get current position of user
    Geolocation.getCurrentPosition(
      (position) => {
        // let yourRealLocation = {
        //   lat: position.coords.latitude,
        //   lng: position.coords.longitude
        // };

        // let nextLocation = {
        //   lat: this.state.nextLocation.lat,
        //   lng: this.state.nextLocation.lng
        // }

        let currentLocation = {
          lat: this.state.currentLocation.lat,
          lng: this.state.currentLocation.lng
        }
        
        // Calculating if location is inside the polygon
        GeoFencing.containsLocation(currentLocation, polygon)
          .then(() => console.log('Je bevindt je nog op het pad, ga zo door!'), this.setState({isEnter: true}))
          .catch(() => this.sendMessage('Je loopt van het pad af! Ga heel snel terug! :('), this.setState({isEnter: false}))
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  // Saving location to phone storage
  storeData = async () => {
    try {
      console.log('Storing location...')
      const jsonValue = JSON.stringify(this.state.currentLocation)
      await AsyncStorage.setItem('location', jsonValue)
      alert('Location Stored!')
    } catch (e) {
      console.warn(e)
    }
  }

  // Getting location from phone storage (if it has one)
  getData = async () => {
    try {
      console.log('Getting previous location...')
      const jsonValue = await AsyncStorage.getItem('location')
      this.setState({
        previousLocation: jsonValue != null ? JSON.parse(jsonValue) : null,
        hasPreviousLocation: true
      })
      console.log('Got previous location!')
    } catch(e) {
      console.warn(e)
    }
  }

  // Helping function to create delay between the Marks of the route
  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  } 
  // Going through the route array and checking every marker
  takeRoute = async () => {
    for ( let i = 0; i < this.route.length; i++) {
      this.setState({
        currentLocation: this.route[i]
      })
      this.checkGeoFencing()
      await this.sleep(5000)
    }
  }

  onPressHandler = () => {
    this.takeRoute()
  }

  polygon = [
    {'latitude': 52.127817, 'longitude': 4.336369,},
    {'latitude': 52.132933, 'longitude': 4.333433,},
    {'latitude': 52.130614, 'longitude': 4.333954,},
    {'latitude': 52.127817, 'longitude': 4.336369,}
  ]

  route = [
    { lat: 52.127817, lng: 4.336369 },
    { lat: 52.128214, lng: 4.336098 },
    { lat: 52.128831, lng: 4.335514 },
    { lat: 52.128931, lng: 4.335214 }, 
    { lat: 52.129747, lng: 4.334897 },
    { lat: 52.131162, lng: 4.334120 },
    { lat: 52.132098, lng: 4.333956 },
    { lat: 52.132933, lng: 4.333433 }
  ]

  render() {
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
          <Polygon coordinates={this.polygon} strokeWidth={2} strokeColor={'red'}/>
          <Marker title={'Current location'} coordinate={{ latitude : this.state.currentLocation.lat, longitude : this.state.currentLocation.lng }} />
          {this.state.hasPreviousLocation ? <Marker title={'Previous location'} coordinate={{ latitude : this.state.previousLocation.lat , longitude : this.state.previousLocation.lng }} /> : null}
        </MapView>
        <View style={styles.content}>
          <Button onPress={this.onPressHandler} title='Start Route!'/>
          {/* <Button onPress={this.storeData} title='Save location'/>
          <Button onPress={this.getData} title='Load previous locaiton'/> */}
        </View>
      </View>
    )
  };
};

const styles = StyleSheet.create({
  map: {
    height: '90%'
  },
  content: {  
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: "row",
    // flexWrap: "wrap",
  }
});


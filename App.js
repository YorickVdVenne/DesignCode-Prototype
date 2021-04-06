/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, Text, Button } from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker, Circle, Polygon} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeoFencing from 'react-native-geo-fencing';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
        currentLocation: {lat: 52.130363, lng: 4.334120},
        nextLocation: {lat: 52.128053, lng: 4.333560},
        previousLocation: null,
        isEnter: false,
        hasPreviousLocation: false
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

  sendMessage = () => {
    //Sending a local notification
    PushNotification.localNotification({
      channelId: "channel-id", 
      title: "Je bent van het pad af gegaan!", // (optional)
      message: "Keer zo snel mogelijk terug.", // (required)
    });
  }

  componentDidMount() {
    // Create data for polygon
    const polygon = [
      { lat: 52.127817, lng: 4.336369 },
      { lat: 52.132933, lng: 4.333433 },
      { lat: 52.130284, lng: 4.332875 },
      { lat: 52.127817, lng: 4.336369 },
    ];

    // Get current position of user
    Geolocation.getCurrentPosition(
      (position) => {
        let yourRealLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        let currentLocation = {
          lat: this.state.currentLocation.lat,
          lng: this.state.currentLocation.lng
        }
        let nextLocation = {
          lat: this.state.nextLocation.lat,
          lng: this.state.nextLocation.lng
        }
        
        // Calculating if location is inside the polygon
        GeoFencing.containsLocation(nextLocation, polygon)
          .then(() => console.log('Je bevindt je nog op het pad, ga zo door!'))
          .catch(() => console.log('Hey! Je bent van het pad af, heel gauw terug gaan!'))
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  onPressHandler = () => {
    this.sendMessage()
    this.state.currentLocation = this.state.nextLocation
  }

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
  getData = async () => {
    try {
      console.log('Getting previous location...')
      const jsonValue = await AsyncStorage.getItem('location')
      this.state.previousLocation = jsonValue != null ? JSON.parse(jsonValue) : null;
      this.state.hasPreviousLocation = true
      console.log('Got previous location!')
    } catch(e) {
      console.warn(e)
    }
  }

  polygon = [
    {'latitude': 52.127817, 'longitude': 4.336369,},
    {'latitude': 52.132933, 'longitude': 4.333433,},
    {'latitude': 52.130284, 'longitude': 4.332875,},
    {'latitude': 52.127817, 'longitude': 4.336369,}
  ]

  render() {
    return (
      <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 52.127817,
          longitude: 4.336369,
          latitudeDelta: 0.009, 
          longitudeDelta: 0.015,
        }}>

        <Polygon coordinates={this.polygon} strokeWidth={2} strokeColor={'red'}/>
        <Marker title={'Current location'} coordinate={{ latitude : this.state.currentLocation.lat , longitude : this.state.currentLocation.lng }} />
        {this.state.hasPreviousLocation ? <Marker title={'Previous location'} coordinate={{ latitude : this.state.previousLocation.lat , longitude : this.state.previousLocation.lng }} /> : null}
      </MapView>
      <View style={styles.content}>

        <Button onPress={this.onPressHandler} title='Next location'/>
        <Button onPress={this.storeData} title='Save location'/>
        <Button onPress={this.getData} title='Load previous locaiton'/>
        <Text>Boundary entered : {this.state.isEnter ? 'Enter' : 'Not Enter'}</Text>
      </View>
      </View>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: '90%'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '10%'
  }
});


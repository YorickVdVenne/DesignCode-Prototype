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

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
        currentLocation: {lat: 52.130363, lng: 4.334120},
        nextLocation: {lat: 52.132933, lng: 4.333433},
        isEnter: false
    }

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
    PushNotification.createChannel(
      {
        channelId: "channel-id", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  sendMessage = () => {
    PushNotification.localNotification({
      channelId: "channel-id", 
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
    });
  }

  polygon = [
    {
      'latitude': 52.127817,
      'longitude': 4.336369,
    },
    {
      'latitude': 52.132933,
      'longitude': 4.333433,
    },
    {
      'latitude': 52.130284,
      'longitude': 4.332875,
    }
  ]
  
  handleUserLocation = () => {
    Geolocation.getCurrentPosition(pos => {
      alert(JSON.stringify(pos))
    })
  }

  onPressHandler = () => {
    this.state.isEnter = true
    console.log("Get next location")
    this.sendMessage()
  }

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
        }}
        >
        <Polygon coordinates={this.polygon} strokeWidth={2} strokeColor={'red'}/>
        <Circle center={{latitude: 52.127817, longitude: 4.336369}} radius={50} strokeWidth={2} strokeColor={'red'}/>
        <Marker coordinate={{ latitude : this.state.currentLocation.lat , longitude : this.state.currentLocation.lng }} />
      </MapView>
      <View style={styles.content}>
        <Button onPress={this.onPressHandler} title='Next location'/>
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


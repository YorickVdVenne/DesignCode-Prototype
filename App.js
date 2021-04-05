/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View, Text, Button } from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'

export default class App extends React.Component {

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
      <Marker
      coordinate={{ latitude : 52.127817 , longitude : 4.336369 }}
      />

      </MapView>
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
    height: '100%'
  }
});


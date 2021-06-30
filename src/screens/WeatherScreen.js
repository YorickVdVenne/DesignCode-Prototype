import React, { useState } from 'react';
import {StyleSheet, View, Text, TextInput, Button } from 'react-native';

export default WeatherScreen = () => {
  // states to store dynamic data
  const [dataSource, setDataSource] = useState(null);
  const [city, setCity] = useState(null);

  // Function that fetches the latest weather updates from the internet based on given city parameter
  checkWeather = () => {
    if(city) {
      return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=31f0fd363b2206807fbebf7df8b8e868`)
        .then((response) => response.json())
        .then((responseJson) => {
          // Storing data object in the state
          setDataSource(responseJson)
      })
      .catch((error) => {
          console.log(error)
      })
    }
  }

  return (
    <View>
      <Text style={styles.introText}>Check the weather of your city before taking a walk</Text>
      <TextInput 
        placeholder='city'
        style={styles.cityInput}
        onChangeText={(text) => setCity(text)}
      />
      <Button title="Check" onPress={() => checkWeather()} />
      {/* If the state has weather data, show specific data */}
      {dataSource ?
          <View>
            <Text style={styles.forecastIntro}>The forecast for today is:</Text>
            <Text style={styles.forecastDescription}>{dataSource.weather[0].description}</Text>
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTemp}>Current Temperature: {dataSource.main.temp}</Text>
              <Text style={styles.forecastFeelTemp}>Feels Temperature: {dataSource.main.feels_like}</Text>
            </View>
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTemp}>Max Temperature: {dataSource.main.temp_max}</Text>
              <Text style={styles.forecastFeelTemp}>Min Temperature: {dataSource.main.temp_min}</Text>
            </View>
          </View>
      :   <Text></Text>}
    </View>
  )
}

// Style component with all the styling of this screen
const styles = StyleSheet.create({
  introText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  cityInput: {
    fontSize: 18,
    margin: 15,
    height: 40,
    borderColor: 'black',
    borderWidth: 1
  },
  forecastIntro: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  forecastDescription: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  forecastTemp: {
    fontSize: 15,
    marginRight: 10
  },
  forecastFeelTemp: {
    fontSize: 15,
    marginLeft: 10
  },
  forecastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  }
});
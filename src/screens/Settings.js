import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from 'react-native-button'

export default Settings = () => {
    const [isEnabled, setIsEnabled] = useState(retrievePreference())

    // Function that retrieves stored preference (if it has any)
    async function retrievePreference() {
        try {
            const jsonValue = await AsyncStorage.getItem('pref');
            const res = jsonValue != null ? JSON.parse(jsonValue) : false;
            setIsEnabled(res)
        } catch(e) {
            console.warn(e)
        }
    }
    
    // Function that stores preferece in localstorage using AsycnStorage
    async function storePreference(pref) {
        try {
            const jsonValue = JSON.stringify(pref)
            await AsyncStorage.setItem('pref', jsonValue)
        } catch (e) {
            console.warn(e)   
        }
    }

    // Function for togglebutton, changes state and stores preference
    const toggleSwitch = () => {
        storePreference(!isEnabled)
        setIsEnabled(previousState => !previousState);
    }

    return (
        <View>
            <Text style={styles.introText}>Do you want to recieve pushnotifications when you go of trail?</Text>
            {/* Change Button styling and content based on stored preference */}
            <Button style={isEnabled ? styles.enabledButton : styles.disabledButton} onPress={() => toggleSwitch()}>
                {isEnabled ? 'Yes' : 'No'}
            </Button>
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
    enabledButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 27,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'green',
        color: 'white',
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    disabledButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 27,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'red',
        color: 'white',
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});
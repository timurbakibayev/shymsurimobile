import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';


const Spinner = ({size}) => {
    return (
        <View>
            <ActivityIndicator
                size={size || 'large'}
            />
        </View>
    )
};


const styles = StyleSheet.create({
    spinnerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export {Spinner}
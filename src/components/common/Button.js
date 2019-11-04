import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const Button = ({onPress, children}) => {
    const {buttonStyle, textStyle} = styles;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={buttonStyle}
        >
            <Text style={textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    buttonStyle: {
        flex: 1,
        backgroundColor: '#FFF',
        alignSelf: 'stretch',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007AFF',
        marginLeft: 5,
        marginRight: 5

    },
    textStyle: {
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    }
});


export {Button}
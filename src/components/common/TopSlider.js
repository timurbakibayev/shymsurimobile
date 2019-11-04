import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const TopSlider = ({onLeftPressed, currentDate, onRightPressed, onDateSelected}) => {
    const {toolbar, toolbarButton, toolbarTitle} = styles;
    return (
        <View style={toolbar}>
            <TouchableOpacity onPress={onLeftPressed}
                              style={toolbarButton}>
                <Icon
                    name="arrow-left" size={20}
                />
            </TouchableOpacity>
            <View style={toolbarTitle}>
                <DatePicker
                    style={{
                        width: 200
                    }}
                    date={currentDate}
                    customStyles={{
                        dateInput: {
                            borderColor: '#FFF', borderWidth: 0
                        }
                    }}
                    mode="date"
                    format="YYYY-MM-DD"
                    minDate="2016-05-01"
                    // maxDate="2017-12-31"
                    confirmBtnText="Подтвердить"
                    cancelBtnText="Отмена"
                    onDateChange={onDateSelected}
                    showIcon={false}
                />
            </View>
            <TouchableOpacity
                style={toolbarButton}
                onPress={onRightPressed}>
                <Icon
                    name="arrow-right" size={20}
                />
            </TouchableOpacity>

        </View>
    )
};

const styles = StyleSheet.create({
    toolbar: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row'
    },
    toolbarButton: {
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    toolbarTitle: {
        justifyContent: 'center',
    }
});


export {TopSlider}
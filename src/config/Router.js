import React from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
// import {Icon} from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import InstructorDetails from '../screens/InstructorsDetails';
import Events from '../screens/Events';
import TakenInstructor from '../screens/TakenInstructor';
import Instructors from '../screens/Instructors';
import AddInstructor from '../screens/AddInstructor';
import AddEvent from '../screens/AddEvent';
import ReportScreen from '../screens/ReportScreen';
import ReportDedailScreen from '../screens/ReportDetailScreen';

export const InstructorStack = StackNavigator({
    Instructors: {
        screen: Instructors,
        navigationOptions: {
            title: 'Расписания'
        }
    },
    // AddInstructor: {
    //     screen: AddInstructor,
    //     navigationOptions: ({navigation}) => ({
    //         title: "Добавить Инструктора"
    //     })
    // },
    Details: {
        screen: InstructorDetails,
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name.toUpperCase()} ${navigation.state.params.phone.toUpperCase()}`,
        }),
    },
    // AddAnotherEvent: {
    //     screen: AddEvent,
    //     navigationOptions: ({navigation}) => ({
    //         title: 'Добавить Занятие'
    //     })
    // }
});

export const EventsStack = StackNavigator({
    Events: {
        screen: ReportScreen,
        navigationOptions: {
            title: 'Отчет'
        }
    },
    ReportDetails: {
        screen: ReportDedailScreen,
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name}`,
        }),
    }
});

// export const TakenInstructorStack = StackNavigator({
//     TakenInstructors: {
//         screen: TakenInstructor,
//         navigationOptions: {
//             title: 'Занятость инструкторов'
//         }
//     },
//
//     AddAnotherEvent: {
//         screen: AddEvent,
//         navigationOptions: ({navigation}) => ({
//             title: 'Добавить Занятие'
//         })
//     }
// });

export const Tabs = TabNavigator({
    Instructors: {
        screen: InstructorStack,
        navigationOptions: {
            tabBarLabel: 'Расписания',
            tabBarIcon: ({tintColor}) => <Icon name="book-open" size={20} color={tintColor}/>,
        },
    },
    // Events: {
    //     screen: EventsStack,
    //     navigationOptions: {
    //         tabBarLabel: 'Отчет',
    //         tabBarIcon: ({tintColor}) => <Icon name="calendar" size={20} color={tintColor}/>,
    //         // tabBarIcon: ({tintColor}) => <Icon name="phone" size={20} color={tintColor}/>,
    //     },
    // },

    // TakenInstructors: {
    //     screen: TakenInstructorStack,
    //     navigationOptions: {
    //         tabBarLabel: 'Расписание занятий',
    //         tabBarIcon: ({tintColor}) => <Icon name="event" size={20} color={tintColor}/>,
    //     },
    // }


}, {
    tabBarOptions: {
        style: {
            backgroundColor: '#1668b5',
            marginTop: 27
        },
        activeTintColor: '#FFF',
        inactiveTintColor: '#BABABA'
    }
});


export const Root = StackNavigator({
    Tabs: {
        screen: Tabs
    }
}, {
    mode: 'modal',
    headerMode: 'none'
});



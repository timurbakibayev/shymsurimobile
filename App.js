import React from 'react';
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import * as Font from 'expo-font';
import {Text} from 'react-native';
// import { StackNavigator, DrawerNavigator } from 'react-navigation';
// import { createAppContainer } from 'react-navigation';
// import { createDrawerNavigator } from 'react-navigation-drawer';
// import { createStackNavigator } from 'react-navigation-stack';
import { SimpleLineIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import reducers from './src/reducers';
import DrawerContent from './src/components/drawerContent';
// import InstructionsScreen from './screens/instructions';
import AuthenticateScreen from './src/screens/authenticate';
// import NotImplementedScreen from './screens/notImplemented';
import WelcomeScreen from './src/screens/welcome';
// import NewsScreen from './screens/news';
// import DisciplinesScreen from './screens/disciplines';
// import AnnouncementsScreen from './screens/announcements';
// import DatabaseScreen from './screens/database';
import OmbudsmanScreen from './src/screens/ombudsman';
// import ScheduleScreen from './screens/schedule';

import Main from './src/components/Main'


export default class App extends React.Component {
    state = {
        loaded: false,
    };

    componentDidMount() {
        this._loadAssetsAsync();
    }

    _loadAssetsAsync = async () => {
        await Font.loadAsync({
            'Material Icons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
            'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
            'SimpleLineIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/SimpleLineIcons.ttf'),
            'simple-line-icons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/SimpleLineIcons.ttf'),
            'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf')
        });
        this.setState({ loaded: true });
    };

    render() {
        const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
        if(!this.state.loaded) return <Text>Loading</Text>;
        return (
            <Provider store={store}>
                <Main/>
            </Provider>
        );
    }
}


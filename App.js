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


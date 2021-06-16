import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import {userNameChanged, passwordChanged, loginUser, setUserLoggedIn} from "../actions";
import {Card, CardSection, Input, Spinner} from "./common";
import {FormLabel, FormInput, Button} from 'react-native-elements';
import {LOGOUT_SUCCESS_TEXT, VERSION} from "../actions/types";
import WelcomeScreen from '../screens/welcome';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import OneSignal from 'react-native-onesignal';


class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            started: false,
            userName: "",
            password: "",
        };
        self = this;
        AsyncStorage.getItem("admin_area").then((password) => {
            if (password === 'iddqd') {
                self.setState({started: true});
            }
        });
    }

    // componentWillMount(){
    //     OneSignal.addEventListener('ids', this.onIds);
    // }
    //
    // componentWillUnmount(){
    //     OneSignal.removeEventListener('ids', this.onIds);
    // }
    //
    // onIds(device){
    //     console.log('Device Info : ', device);
    // }


    async componentDidMount() {
        self = this;
        await AsyncStorage.getItem("admin_area").then((password) => {
            if (password === 'iddqd') {
                self.setState({started: true});
            }
        });

        const userName = await AsyncStorage.getItem("userName");

        const password = await AsyncStorage.getItem("password");
        console.log("recovered", userName, password)

        this.setState({"userName": userName, "password": password})

        const token = await AsyncStorage.getItem("token");

        if (token) {
                console.log("This is in Login making user login");
                // this.props.setUserLoggedIn();
                this.props.loginUser({userName, password});
            }
        };

    onButtonPressed() {
        this.props.loginUser(this.state);
        LoginForm.saveItem("userName", this.state.userName);
        LoginForm.saveItem("password", this.state.password);
        console.log("saved")
    }


    static async saveItem(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.log("AsyncStorage Error ", error);
        }
    }

    renderButton() {
        if (this.props.isLoading) {
            return <Spinner size="large"/>
        }

        return (
            <Button
                raised
                backgroundColor="#166FBB"
                onPress={this.onButtonPressed.bind(this)}
                title='Войти'/>
        )
    }

    renderLoggedOut() {
        const {logoutTextStyle} = styles;
        if (this.props.loggedOut) {
            return (<Text style={logoutTextStyle}>{LOGOUT_SUCCESS_TEXT}</Text>);
        } else {
            return (<View/>)
        }
    }

    start() {
        this.setState({started: true});
        AsyncStorage.setItem("admin_area", "iddqd");
    }

    unstart() {
        this.setState({started: false});
        AsyncStorage.setItem("admin_area", "");
        AsyncStorage.setItem("token", "");
    }

    render() {
        const {container, outerContainer, errorTextStyle, imageStyle} = styles;

        if (this.state.started)
            return (
                <View
                    style={container}
                    behavior="padding">

                    <View style={outerContainer}>
                        <TouchableHighlight onPress ={ this.unstart.bind(this)}>
                            <Image source={require('../img/logo.png')} style={imageStyle}/>
                        </TouchableHighlight>

                        <FormLabel>Логин</FormLabel>
                        <FormInput
                            autoCorrect={false}
                            autoCapitalize='none'
                            placeholder="Логин"
                            onChangeText={(text)=>{this.setState({userName: text})}}
                            value={this.state.userName}
                        />
                        <FormLabel>Пароль</FormLabel>
                        <FormInput
                            autoCorrect={false}
                            autoCapitalize='none'
                            secureTextEntry
                            placeholder="Пароль"
                            onChangeText={(text)=>{this.setState({password: text})}}
                            value={this.state.password}
                        />
                        <Text style={errorTextStyle}>
                            {this.props.error}
                        </Text>
                        {this.renderLoggedOut()}
                        <CardSection>
                            {this.renderButton()}
                        </CardSection>

                        <Text style={{margin: 10}}>{VERSION}</Text>

                    </View>
                </View>
            );
        return (
            <WelcomeScreen start={this.start.bind(this)}/>
        )
    }
}


const styles = StyleSheet.create({
    imageStyle: {
        alignSelf: 'center',
        width: 60,
        height: 60
    },
    container: {
        flex: 1,
    },
    outerContainer: {
        flex: 1,
        marginTop: 40,
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },

    logoutTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'green'
    }

});


const mapStateToProps = ({auth}) => {
    const {userName, password, error, isLoading, loggedOut} = auth;
    return {userName, password, error, isLoading, loggedOut}
};

export default connect(mapStateToProps, {userNameChanged, passwordChanged, loginUser, setUserLoggedIn})(LoginForm)





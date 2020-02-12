import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    AsyncStorage,
    TouchableHighlight
} from 'react-native';
import {connect} from 'react-redux';
import {userNameChanged, passwordChanged, loginUser, setUserLoggedIn} from "../actions";
import {Card, CardSection, Input, Spinner} from "./common";
import {FormLabel, FormInput, Button} from 'react-native-elements';
import {LOGOUT_SUCCESS_TEXT, VERSION} from "../actions/types";
import WelcomeScreen from '../screens/welcome';

// import OneSignal from 'react-native-onesignal';


class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            started: false,
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


    async componentWillMount() {
        self = this;
        await AsyncStorage.getItem("admin_area").then((password) => {
            if (password === 'iddqd') {
                self.setState({started: true});
            }
        });

        const userName = await AsyncStorage.getItem("userName");

        self.props.userNameChanged(userName);

        const password = await AsyncStorage.getItem("password");

        self.props.passwordChanged(password);

        const token = await AsyncStorage.getItem("token");

        if (token) {
                console.log("This is in Login making user login");
                // this.props.setUserLoggedIn();
                this.props.loginUser({userName, password});
            }
        };


    onUserNameChange(text) {
        this.props.userNameChanged(text);
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }

    onButtonPressed() {
        const {userName, password} = this.props;
        this.props.loginUser({userName, password});
        LoginForm.saveItem("userName", userName);
        LoginForm.saveItem("password", password);
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
                <KeyboardAvoidingView
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
                            onChangeText={this.onUserNameChange.bind(this)}
                            value={this.props.userName}
                        />
                        <FormLabel>Пароль</FormLabel>
                        <FormInput
                            autoCorrect={false}
                            autoCapitalize='none'
                            secureTextEntry
                            placeholder="Пароль"
                            onChangeText={this.onPasswordChange.bind(this)}
                            value={this.props.password}
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
                </KeyboardAvoidingView>
            );
        return (
            <WelcomeScreen start={this.start.bind(this)}/>
        )
    }
}


const styles = StyleSheet.create({
    imageStyle: {
        alignSelf: 'center',
        width: 140,
        height: 140
    },
    container: {
        flex: 1,
    },
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
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





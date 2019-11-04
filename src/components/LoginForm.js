import React from 'react';
import {StyleSheet, View, Text, Image, ScrollView, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {userNameChanged, passwordChanged, loginUser, setUserLoggedIn} from "../actions";
import {Card, CardSection, Input, Spinner} from "./common";
import {FormLabel, FormInput, Button} from 'react-native-elements';
import {LOGOUT_SUCCESS_TEXT, VERSION} from "../actions/types";

// import OneSignal from 'react-native-onesignal';


class LoginForm extends React.Component {


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


    componentWillMount() {
        AsyncStorage.getItem("userName").then((userName) => {
            if (userName) {
                console.log("This is userName in Login", userName);
                this.props.userNameChanged(userName);
            }
        });

        AsyncStorage.getItem("password").then((password) => {
            if (password) {
                console.log("This is password", password);
                this.props.passwordChanged(password);
            }
        });

        AsyncStorage.getItem("token").then((token) => {
            if (token) {
                console.log("This is in Login making user login");
                this.props.setUserLoggedIn();
            }
        });
    }

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

    render() {
        const {container, outerContainer, errorTextStyle, imageStyle} = styles;

        return (
            <KeyboardAvoidingView
                style={container}
                behavior="padding">

                <View style={outerContainer}>
                    <Image source={require('../img/logo.png')} style={imageStyle}/>


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

                    <Text>{VERSION}</Text>

                </View>
            </KeyboardAvoidingView>
        );
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





import React from 'react';
import {Text, View, Alert, AsyncStorage} from 'react-native';
import Instructor from '../screens/Instructor';
import Instructors from '../screens/Instructors'
import {connect} from 'react-redux'
import LoginForm from './LoginForm'
import {navigateScreen} from "../actions/screen";
// import {Root} from '../config/Router';


class Main extends React.Component {


    componentWillMount() {
        AsyncStorage.getItem("token").then((token) => console.log("This is retrieved token ", token));
    }

    static async saveItem(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
            // console.log("This is saving item ", item ,selectedValue);
        } catch (error) {
            // console.log("AsyncStorage Error ", error);
        }
    }

    render() {
        if (this.props.isLoggedIn) {
            const {user} = this.props;
            // console.log("This is user token in async ", user.token);
            // console.log("This is role ", user.role);
            // console.log("This is user", user);
            // console.log("this is username", this.props.userName);
            if (user) {
                // console.log("about to save token");
                Main.saveItem("token", user.token);
            }
            if (user && user.role === "trainer") {
                return <Instructor/>
            } else {
                return <Instructors/>
            }
        } else {
            return (
                <View style={{flex: 1}}>
                    <LoginForm/>
                </View>);
        }
    }
}


const mapStateToProps = ({auth}) => {
    const {isLoggedIn, user, userName,} = auth;
    return {isLoggedIn, user, userName};
};

export default connect(mapStateToProps, {navigateScreen})(Main)
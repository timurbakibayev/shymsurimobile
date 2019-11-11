import React, {Component} from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Dimensions,
} from 'react-native';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Icon from "react-native-vector-icons/FontAwesome";
import * as Actions from '../actions';
import Slides from '../components/slides'

import {loginUser} from "../api/authentication";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').width;


class Authenticate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:"",
            password:"",
        };
        self = this;
    }

    componentDidMount() {
    }

    static navigationOptions = {
        title: 'Авторизация',
        //tabBarIcon: ({ tintColor }) => <Icon name={"graduation-cap"} size={30} color={tintColor} />
    };

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#2196f3', paddingTop: SCREEN_HEIGHT/10, alignItems: "center"}}>
                <Text style={{color: "white", fontSize: 18}}>Имя пользователя</Text>
                <TextInput returnKeyType = {"next"} style={{color: "white", height: 40, width: SCREEN_WIDTH*2/3, borderColor: 'gray', borderWidth: 1}}
                           onChangeText={(e)=>{this.setState({username: e})}}
                           onSubmitEditing={() => this.passwordInput.focus()}/>
                <Text></Text>
                <Text style={{color: "white", fontSize: 18}}>Пароль</Text>
                <TextInput secureTextEntry style={{color: "white", height: 40, width: SCREEN_WIDTH*2/3, borderColor: 'gray', borderWidth: 1}}
                           onChangeText={(e)=>{this.setState({password: e})}}
                           onSubmitEditing = {()=>{
                               console.log("Submitting");
                               loginUser(this.state);
                           }}
                           returnKeyType = "go"
                           ref={(input)=>this.passwordInput = input}/>
            </View>
        );
    }
}


function mapStateToProps(state, props) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);

const styles = StyleSheet.create({
    activityIndicatorContainer: {
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    row: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        padding: 10
    },

    title: {
        fontSize: 15,
        fontWeight: "600"
    },

    description: {
        marginTop: 5,
        fontSize: 14,
    }
});
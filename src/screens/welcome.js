import React, {Component} from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    ActivityIndicator
} from 'react-native';


import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";
import * as Actions from '../actions';
import Slides from '../components/slides';
import Game from '../screens/Game';

const SLIDES_DATA = [
    {text: "Меню пользователя выдвигается слева", color: '#009688'},
    {text: "Для начала работы необходимо авторизоваться", color: '#03A9F4'},
];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {game: false};

    }

    componentDidMount() {
    };

    startGame() {
      this.setState({...this.state, game: true});
    };

    static navigationOptions = {
        title: 'Welcome',
        header: null,
        //tabBarIcon: ({ tintColor }) => <Icon name={"graduation-cap"} size={30} color={tintColor} />
    };

    render() {
        if (this.state.game)
            return (
                <View style={{flex: 1, backgroundColor: '#F5F5F5', paddingTop: 20}}>
                    <Game/>
                </View>
            );
        return (
            <View style={{flex: 1, backgroundColor: '#F5F5F5', paddingTop: 20}}>
                <Slides data={SLIDES_DATA} onComplete = {()=>{this.props.start()}}
                    runGame = {()=>{this.startGame()}}/>
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


export default connect(mapStateToProps, mapDispatchToProps)(Home);

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
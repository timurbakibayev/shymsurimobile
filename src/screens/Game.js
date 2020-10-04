import React, {Component} from 'react';
import {View, Text, ScrollView, Dimensions, Image} from 'react-native';
import {Button} from 'react-native-elements';
import logo from '../img/logo.png';
import ski_ani from '../img/animated-skiing-image-0012.gif';
import logo_shym from '../img/shymbulak_logo.png';
import instr1 from '../img/Pedus-Sergej-kopiya-400x600.jpg';
import instr2 from '../img/Ahmetov-Damir-400x600.jpg';
import instr3 from '../img/Stenin-Radion-3-kopiya-400x600.jpg';
import { Linking, TouchableHighlight } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').width;

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tapsImage: 0,
            tapsText: 0,
            beforeWasText: false,
        };
    }

    tapImage() {
        console.log(this.state.tapsImage, this.state.tapsText );
        if (this.state.tapsImage + 1 === 5 && this.state.tapsText === 5 || this.state.tapsImage + 1 === 10) {
            this.props.onComplete();
        }
        if (this.state.beforeWasText)
            this.setState({tapsImage: 1, tapsText: 0, beforeWasText: false});
        else
            this.setState({tapsImage: this.state.tapsImage + 1, tapsText: 0});
    }

    runGame() {
        this.props.runGame();
    }

    tapText() {
        console.log(this.state.tapsImage, this.state.tapsText );
        if (this.state.tapsImage === 5 && this.state.tapsText + 1 === 5) {
            this.props.onComplete();
        }
        this.setState({tapsText: this.state.tapsText + 1, beforeWasText: true});
    }

    render() {
        return (
            <ScrollView
                horizontal
                style={{flex: 1}}
                pagingEnabled
            >
                <Text>Game Started</Text>
            </ScrollView>
        )
    }
}

const styles = {
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH,
    },
    slideScroll: {
        flex: 1,
        width: SCREEN_WIDTH,
    },
    slideText: {
        fontSize: 30,
        color: "white",
        textAlign: "center",
    },
    button: {
        backgroundColor: '#0288D1',
    }
}

export default Game;
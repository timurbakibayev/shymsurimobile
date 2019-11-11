import React, {Component} from 'react';
import {View, Text, ScrollView, Dimensions, Image} from 'react-native';
import {Button} from 'react-native-elements';
import logo from '../img/logo.png';
import logo_shym from '../img/shymbulak_logo.png';
import instr1 from '../img/Pedus-Sergej-kopiya-400x600.jpg';
import instr2 from '../img/Ahmetov-Damir-400x600.jpg';
import instr3 from '../img/Stenin-Radion-3-kopiya-400x600.jpg';
import ReactFlowPlayer from "react-flow-player";
import { Linking, TouchableHighlight } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').width;

class Slides extends Component {
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
        if (this.state.tapsImage + 1 === 5 && this.state.tapsText === 5) {
            this.props.onComplete();
        }
        if (this.state.beforeWasText)
            this.setState({tapsImage: 1, tapsText: 0, beforeWasText: false});
        else
            this.setState({tapsImage: this.state.tapsImage + 1, tapsText: 0});
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
                <View style={[styles.slide, {backgroundColor: "#2196f3"}]}>
                    <TouchableHighlight onPress ={ this.tapImage.bind(this)}>
                    <Image style={{
                        width:SCREEN_WIDTH/2,
                        resizeMode: "contain",
                        height: SCREEN_WIDTH/2,
                        marginTop: -SCREEN_HEIGHT/2,
                    }} source={logo} onPress = {this.tapImage.bind(this)}/>
                    </TouchableHighlight>

                    <Text style={styles.slideText} onPress = {this.tapText.bind(this)}>Школа горных лыж и сноуборда</Text>

                </View>
                <View style={[styles.slide, {backgroundColor: "#009688", padding: 20}]}>
                    <Image style={{
                        width:SCREEN_WIDTH/2,
                        resizeMode: "contain",
                        height: SCREEN_WIDTH/4,
                        marginTop: -SCREEN_HEIGHT/4,
                    }} source={logo_shym}/>
                    <Text style={{...styles.slideText, fontSize: 15}}>Катание на горных лыжах – увлекательное и полезное
                        для здоровья занятие, учиться которому никогда не поздно. Главная цель нашей школы – научить всех
                        желающих красиво, технично и безопасно кататься по склонам «Шымбулака» и любым трассам мира!</Text>
                    <Text style={{color: 'blue', fontSize: 20, marginTop: 20}}
                              onPress={() => Linking.openURL('https://booking.instructor-shym.kz/')}>
                          Забронировать занятие
                        </Text>
                </View>
                <View style={[styles.slideScroll, {backgroundColor: "#03A9F4"}]}>

                    <ScrollView
                            style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 20, marginBottom: 40, alignContent: 'center'}}
                        >

                        <Text style={{...styles.slideText, marginTop: 10}}>Супервайзоры</Text>

                        <Image style={{
                            width:SCREEN_WIDTH-20,
                            resizeMode: "contain",
                            marginTop: 10,
                        }} source={instr1}/>

                        <Image style={{
                            width:SCREEN_WIDTH-20,
                            resizeMode: "contain",
                            marginTop: 10,
                        }} source={instr2}/>

                        <Image style={{
                            width:SCREEN_WIDTH-20,
                            resizeMode: "contain",
                            marginTop: 10,
                        }} source={instr3}/>
                    </ScrollView>
                    {/*<Button*/}
                    {/*            title = "Начать"*/}
                    {/*            raised*/}
                    {/*            onPress = {this.props.onComplete}*/}
                    {/*            buttonStyle = {styles.button}*/}
                    {/*        ></Button>*/}
                </View>
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

export default Slides;
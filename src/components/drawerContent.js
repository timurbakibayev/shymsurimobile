import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {URL} from '../api/url';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    Image,
    ActivityIndicator,
    TouchableHighlight,
    Dimensions,
} from 'react-native';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";
import Slides from '../components/slides';
// import * as Actions from '../actions/userInfo';

class DrawerContent extends Component {

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    constructor(props) {
        super(props);
        this.state = {text: "Content of a drawer"};
    }

    componentDidMount() {
        this.props.load();
    }

    render() {
        //console.log(this.props);
        // const photoUrl = `${URL}${this.props.userInfo.photo}`;
        const photoUrl = `${URL}`;
        let userRole = this.props.userInfo.role ? this.props.userInfo.role : "";
        userRole = userRole.replace("teacher", "Преподаватель");
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", margin: "auto", paddingTop: 20, paddingLeft: 10}}>
                        <View style={styles.photo}>
                            <View style={{
                                borderRadius: Dimensions.get('window').height / 18,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "green",
                                overflow: "hidden",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "auto",
                            }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: "100%",
                                        height: "100%",
                                        resizeMode: "cover",
                                    }}
                                    source={{uri: photoUrl}}
                                />
                            </View>
                        </View>
                        <View style={styles.inHeader3}>
                            <Text
                                style={styles.headerText}>{this.props.userInfo ? this.props.userInfo.fullname : "Loading..."}</Text>
                        </View>
                    </View>
                    <View style={styles.inHeader3}>
                        <Text style={styles.headerText}>{userRole}</Text>
                    </View>
                </View>
                <View style={styles.menu}>
                    <TouchableHighlight style={styles.menuItem} onPress={() => {
                        this.props.navigation.navigate('news');
                    }}>
                        <View style={{flexDirection: "row"}}>
                            <Icon style={styles.menuItemText} name="feed"/><Text
                            style={styles.menuItemText}>Новости</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.menuItem} onPress={() => {
                        this.props.navigation.navigate('announcements');
                    }}>
                        <View style={{flexDirection: "row"}}>
                            <Icon style={styles.menuItemText} name="newspaper-o"/><Text
                            style={styles.menuItemText}>Объявления</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.menuItem} onPress={() => {
                        this.props.navigation.navigate('schedule');
                    }}>
                        <View style={{flexDirection: "row"}}>
                            <Icon style={styles.menuItemText} name="calendar"/><Text
                            style={styles.menuItemText}>Расписание</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.menuItem} onPress={() => {
                        this.props.navigation.navigate('disciplines');
                    }}>
                        <View style={{flexDirection: "row"}}>
                            <Icon style={styles.menuItemText} name="briefcase"/><Text
                            style={styles.menuItemText}>Дисциплины</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.menuItem} onPress={() => {
                        this.props.navigation.navigate('database');
                    }}>
                        <View style={{flexDirection: "row"}}>
                            <Icon style={styles.menuItemText} name="eercast"/><Text style={styles.menuItemText}>База
                            знаний</Text>
                        </View>

                    </TouchableHighlight>
                    <TouchableHighlight style={styles.menuItem} onPress={() => {
                        this.props.navigation.navigate('ombudsman');
                    }}>
                        <View style={{flexDirection: "row"}}>
                            <Icon style={styles.menuItemText} name="handshake-o"/><Text
                            style={styles.menuItemText}>Омбудсмен</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.menuItem} onPress={() => {
                        this.props.navigation.navigate('instructions');
                    }}>
                        <View style={{flexDirection: "row"}}>
                            <Icon style={styles.menuItemText} name="rocket"/><Text
                            style={styles.menuItemText}>API</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
            ;
    }

}

styles = {
    container: {
        height: Dimensions.get('window').height,
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
    },
    header: {
        height: Dimensions.get('window').height / 3.5,
        width: "100%",
        backgroundColor: "#ff4466",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1%",
    },
    photo: {
        width: Dimensions.get('window').height / 9,
        height: Dimensions.get('window').height / 9,
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
    },
    inHeader3: {
        flex: 1,
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        fontSize: 20,
        fontWeight: '300',
        color: "white",
        textAlign: "center",
        margin: 5,
    },
    menuItem: {
        margin: 10,
    },
    menuItemText: {
        fontSize: 17,
        color: "black",
        textAlign: "left",
        marginRight: 10,
    },
    menu: {
        height: Dimensions.get('window').height * 2 / 3,
        width: "100%",
        backgroundColor: "#fefefe",
        flexDirection: "column",
        padding: "3%",
    },
};

function mapStateToProps(state, props) {
    return {
        // userInfo: state.userInfoReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

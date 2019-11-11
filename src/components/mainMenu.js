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
import Drawer from 'react-native-drawer'
import * as Actions from '../actions';
import Slides from '../components/slides'
import DrawerContent from './drawerContent';

let drawer = null;

class DrawerLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    closeDrawer = () => {
        drawer.close()
    };

    componentDidMount() {
    }

    render() {
        return (
            <Drawer
                ref={(ref) => drawer = ref}
                type="overlay"
                content={(
                    <DrawerContent closeDrawer={this.closeDrawer} window = {this.props.window} mainNavi={this.props.mainNavi}/>
                )}
                tapToClose={true}
                panOpenMask={0.1}
                openDrawerOffset={0.4}
                panCloseMask={0.2}
                closedDrawerOffset={3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
            >
                {this.props.window}
            </Drawer>
        );
    }

}


function mapStateToProps(state, props) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DrawerLeft);

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


const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 3},
}

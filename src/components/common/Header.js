import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

// // const Header = () => {
// //     return <Text style={styles.textStyle}>Albums</Text>
// // }
//
// // const Header = ({headerText}) => {
// //     const {toolbar, toolbarButton, toolbarTitle} = styles;
// //     // if (this.props.onLeftPressed) {
// //     //     return (
// //     //         <View style={styles.viewStyle}>
// //     //             <TouchableOpacity onPress={onLeftPressed}
// //     //                               style={toolbarButton}>
// //     //                 <Icon
// //     //                     name="arrow-left" size={20}
// //     //                 />
// //     //             </TouchableOpacity>
// //     //             <Text style={styles.textStyle}>{this.props.headerText}</Text>
// //     //         </View>
// //     //     );
// //     // } else {
// //     return (
// //         <View style={styles.viewStyle}>
// //             <Text style={styles.textStyle}>{headerText}</Text>
// //         </View>
// //     );
// //     // }
// //
// //
// // };
//
//
const Header = ({onReturnPressed, onLogoutPressed, headerText}) => {
    if (onReturnPressed) {
        return (
            <View style={styles.viewStyle1}>
                <TouchableOpacity onPress={onReturnPressed}
                                  style={styles.toolbarButton}
                >
                    <Icon
                        name="arrow-left" size={20} backgroundColor={"#1668B5"}
                    />
                </TouchableOpacity>
                <View style={{flex: 0.5}}>
                    <Text style={{...styles.textStyle, width: '75%'}}>{headerText}</Text>
                </View>
                {/*<TouchableOpacity*/}
                {/*style={styles.toolbarButton}/>*/}
                <TouchableOpacity onPress={onLogoutPressed}
                                  style={styles.toolbarButton}
                >
                    <Icon
                        name="logout" size={20} backgroundColor={"#1668B5"}
                    />
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={styles.viewStyle1}>
                <TouchableOpacity
                    style={styles.toolbarButton}
                />
                <View style={{flex: 0.8}}>
                <Text style={styles.textStyle}>{headerText}</Text>
                    </View>
                <TouchableOpacity onPress={onLogoutPressed}
                                  style={styles.toolbarButton}
                >
                    <Icon
                        name="logout" size={20} backgroundColor={"#1668B5"}
                    />
                </TouchableOpacity>
            </View>
        );
    }
};

// export default class Header extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         if (this.props.return) {
//             return (
//                 <View style={styles.viewStyle}>
//                     <TouchableOpacity onPress={onLeftPressed}
//                                       style={toolbarButton}>
//                         <Icon
//                             name="arrow-left" size={20}
//                         />
//                     </TouchableOpacity>
//                     <Text style={styles.textStyle}>{this.props.headerText}</Text>
//                 </View>
//             );
//         } else {
//             return (
//                 <View style={styles.viewStyle}>
//                     <Text style={styles.textStyle}>{this.props.headerText}</Text>
//                 </View>
//             );
//         }
//     }
// }
const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingTop: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative',
    },

    viewStyle1: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingTop: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative',
    },
    textStyle: {
        fontSize: 16,
        alignSelf: 'center',
        alignContent: 'center',
        color: "#1668b5",
        justifyContent: 'center',
        fontWeight: '600'
    },
    toolbar: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row'
    },
    toolbarButton: {
        alignSelf: 'center',
        padding: 10
    },
    toolbarTitle: {
        justifyContent: 'center',
    }
});

export {Header};
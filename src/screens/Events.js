import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {List, ListItem, Button} from 'react-native-elements';
import {connect} from 'react-redux';
// import {Button} from "../components/common/Button";
import {getUsers, getTrainers, getInstructorDetails, getEvents} from "../actions/users";
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';


class Events extends React.Component {

    componentWillMount() {
        const {token} = this.props.user;
        this.props.getEvents({token});
    }

    onAddEvent = () => {
        this.props.navigation.navigate('AddAnotherEvent')
    };


    render() {
        const {events} = this.props;
        if (events.length < 1) {
            return (<Text>У Вас нет занятий</Text>)
        } else {
            const {head, title, row, text} = styles;
            const tableHead = [" ", "Дата", "Время", "Тариф"];
            const indexes = [];
            const trainings = [];
            if (events) {
                let arr = events;
                console.log("This is event size ", arr.length);
                for (let i = 0; i < arr.length; i++) {
                    indexes.push(i);
                    let dateTime = arr[i].start.split(" ");
                    if (dateTime.length < 2) {
                        dateTime = arr[i].start.split("T");
                    }
                    trainings.push([dateTime[0], dateTime[1], arr[i].tarif_txt]);
                }
            }

            return (
                <ScrollView>
                    <Table>
                        <Row data={tableHead} style={head} flexArr={[1, 5, 5, 5]} textStyle={text}/>
                        <TableWrapper style={{flexDirection: 'row'}}>
                            <Col data={indexes} style={styles.title} heightArr={[28, 28]} textStyle={styles.text}/>
                            <Rows data={trainings} flexArr={[5, 5, 5]} style={row} textStyle={styles.rowText}/>
                        </TableWrapper>
                    </Table>
                </ScrollView>
            )
        }
    }
}


const mapStateToProps = ({users, auth}) => {
    const {events} = users;
    const {user} = auth;
    return {events, user}
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF'
    },
    head: {height: 40, backgroundColor: '#f1f8ff'},
    text: {marginLeft: 5},
    row: {height: 30},
    title: {flex: 1, backgroundColor: '#f6f8fa'},
    rowText: {height: 28, textAlign: 'center'},
});


export default connect(mapStateToProps, {getEvents})(Events);
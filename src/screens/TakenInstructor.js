import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {List, ListItem, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {getTakenTrainerOnDate} from '../actions/takenTrainer';
import DatePicker from 'react-native-datepicker';
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';

// import {Button} from "../components/common/Button";


class TakenInstructor extends React.Component {

    onDateStartChange(date) {
        const {user} = this.props;
        console.log("This is the date", date);
        console.log("This is the userToken", user.token);
        this.props.getTakenTrainerOnDate(user, date);
    }

    onAddEvent = () => {
        this.props.navigation.navigate('AddAnotherEvent')
    };

    renderList() {
        const {head, title, row, text} = styles;
        const tableHead = [" ", "Дата", "Время", "Тариф"];
        if (this.props.loadedEvents.length === 0) {
            return (
                <Text style={{textAlign: 'center', paddingTop: 15, paddingBottom: 15, backgroundColor: '#FFF'}}>
                    Даты не выбраны
                </Text>
            )
        }
        if (this.props.loadedEvents) {
            const indexes = [];
            for (let i = 0; i < this.props.loadedEvents.length; i++) {
                indexes.push(i);
            }
            return (
                <View>
                    <Table>
                        <Row data={tableHead} style={head} flexArr={[1, 5, 5, 5]} textStyle={text}/>
                        <TableWrapper style={{flexDirection: 'row'}}>
                            <Col data={indexes} style={styles.title} heightArr={[28, 28]} textStyle={styles.text}/>
                            <Rows data={this.props.loadedEvents} flexArr={[5, 5, 5]} style={row}
                                  textStyle={styles.text}/>
                        </TableWrapper>
                    </Table>
                </View>
            );
        }
    }


    render() {
        const {container, topOffset} = styles;
        return (
            <View style={container}>
                <DatePicker
                    style={{width: 200, marginTop: 15}}
                    // date={this.props.trainingTimeDateStart}
                    mode="datetime"
                    placeholder="Период с"
                    // format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    minDate="2016-05-01"
                    // maxDate="2017-12-31"
                    confirmBtnText="Подтвердить"
                    cancelBtnText="Отмена"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                    }}
                    onDateChange={this.onDateStartChange.bind(this)}
                />
                <DatePicker
                    style={{width: 200, marginTop: 15}}
                    // date={this.props.trainingTimeDateStart}
                    mode="datetime"
                    placeholder="Период по"
                    // format="YYYY-MM-DD"
                    format="YYYY-MM-DD HH:mm:ss"
                    minDate="2016-05-01"
                    // maxDate="2017-12-31"
                    confirmBtnText="Подтвердить"
                    cancelBtnText="Отмена"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                    }}
                    // onDateChange={this.onDateEndChange.bind(this)}
                />
                <Button
                    buttonStyle={{marginTop: 15}}
                    raised
                    backgroundColor='#1668B5'
                    title='Добавить занятие'
                    onPress={() => this.onAddEvent()}/>
                <ScrollView>
                    {this.renderList()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF'
    },
    head: {height: 40, backgroundColor: '#f1f8ff'},
    title: {flex: 1, backgroundColor: '#f6f8fa'},
    row: {height: 28},
    text: {textAlign: 'center'},
    topOffset: {marginTop: 15}
});

const mapStateToProps = ({takenTrainer, auth}) => {
    const {user} = auth;
    const {loadedEvents, loadedEventsFail} = takenTrainer;
    return {user, loadedEvents, loadedEventsFail};
};


export default connect(mapStateToProps, {getTakenTrainerOnDate})(TakenInstructor);
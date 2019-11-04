import React from 'react';
import {ScrollView, Text, StyleSheet, Alert, View} from 'react-native';
import {List, ListItem, Button} from 'react-native-elements';
// import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';
import {connect} from 'react-redux';
import DatePicker from 'react-native-datepicker';
import {TouchableOpacity, BackHandler} from 'react-native';
import call from 'react-native-phone-call';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {TopSlider} from "../components/common";
import {
    instructorAddEvent,
    instructorShowReport,
    instructorAddEventStart,
    instructorAddEventEnd,
    instructorAddEventToServer,
    instructorAddReportStart,
    instructorAddReportEnd,
    getReportOnSelectedDate,
    setInstructorCurrentDate,
    getEventsOnSelectedDate,
    deleteEventFromServer,
    changeDate
} from '../actions/instructorDetailsAction';
import {
    Cell,
    Section,
    TableView,
} from 'react-native-tableview-simple';


class InstructorsDetails extends React.Component {

    instructorReport(report) {
        console.log("This is rep element", report);
        const {id, name, rating} = this.props.navigation.state.params;
        if (id === report[0]) {
            return (
                <CellVariant name={report[1]}
                             title2={report[2]}
                             title3={report[3]}
                             title4={report[4]}/>
            )
        }
    }


    instructorTraining(training) {
        console.log("this is training ", training);
        console.log("This is own client", training[4]);
        if (training[4]) {
            return (
                <Cell
                    cellContentView={
                        <View
                            style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[0]}
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[1]}
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {
                                    training[2]
                                }
                            </Text>

                            <TouchableOpacity onPress={this.deleteEvent.bind(this, training[3])}>
                                <Icon name="close" size={20}/>
                            </TouchableOpacity>
                        </View>
                    }
                />
            );
        } else {
            return (
                <Cell
                    cellContentView={
                        <View
                            style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[0]}
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[1]}
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[2]}
                            </Text>
                        </View>
                    }
                />
            );
        }

        // this.renderTraining(training);
        // if (training.own_client) {
        //     return (
        //         <TrainingCell1 name={training[0]}
        //                        title2={training[1]}
        //                        title3={training[2]}
        //                        deleteEvent={this.deleteEvent.bind(this, training[3])}
        //                        id={training.id}
        //                        own_client={training[4]}
        //         />
        //     )
        // } else {
        //     return (
        //         <TrainingCell1 name={training[0]}
        //                        title2={training[1]}
        //                        title3={training[2]}
        //                        own_client={training[4]}
        //         />
        //     )
        // }
    }


    leftPressed() {
        const {instructorCurrentDate} = this.props;
        this.props.changeDate(instructorCurrentDate, "-");
        const {user} = this.props;
        this.props.getEventsOnSelectedDate(user, instructorCurrentDate);
        // this.props.getTrainersAtWork(user, instructorsCurrentDate);
    }

    rightPressed() {
        const {instructorCurrentDate} = this.props;
        this.props.changeDate(instructorCurrentDate, "+");
        const {user} = this.props;
        this.props.getEventsOnSelectedDate(user, instructorCurrentDate);
        // this.props.getTrainersAtWork(user, instructorsCurrentDate);
    }


    componentWillMount() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!

        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        let currentDay = yyyy + "-" + mm + '-' + dd;
        this.props.setInstructorCurrentDate(currentDay);
        const {user} = this.props;
        this.updateEvents(user, currentDay);
    }


    onDateChanged(date) {
        console.log("This is instructor's date ", date);
        const {user} = this.props;
        this.updateEvents(user, date)
        this.props.setInstructorCurrentDate(date);
    }

    updateEvents(user, date) {
        this.props.getEventsOnSelectedDate(user, date);
    }


    renderReports() {
        const {reports} = this.props;
        if (reports.length > 0) {
            return (
                <TableView>
                    <Section>
                        <CellVariant name="Забронировано" title2="Подтверждено" title3="Часы" title4="Начисленно"/>
                        {reports.map((report) => (
                            this.instructorReport(report)
                        ))}
                    </Section>
                </TableView>
            );
        } else {
            return (<View/>)
        }
    }

    deleteEvent = (id) => {
        const {user, instructorCurrentDate} = this.props;
        console.log("This is user and id ", user.token, id);
        this.props.deleteEventFromServer(user, id);
    };


    onAddEvent = () => {
        this.props.instructorAddEvent();
    };

    onShowReport = () => {
        this.props.instructorShowReport();
    };

    onSaveEvent = () => {
        const {user, showAddEvent, instructorEventStart, instructorEventEnd} = this.props;
        const {id, name, rating} = this.props.navigation.state.params;
        console.log("All about instructor", id + " " + name + " " + rating + " " + user.token);
        console.log("This is event to save ", instructorEventStart + " " + instructorEventEnd);
        this.props.instructorAddEventToServer({user, id, name, rating, instructorEventStart, instructorEventEnd});
    };

    getReport = () => {
        const {user, instructorReportStart, instructorReportEnd} = this.props;
        this.props.getReportOnSelectedDate(user, instructorReportStart, instructorReportEnd)
    };

    onInstructorEventDateStart(date) {
        this.props.instructorAddEventStart(date);
    }

    onInstructorEventDateEnd(date) {
        this.props.instructorAddEventEnd(date);
    }


    onInstructorReportDateStart(date) {
        this.props.instructorAddReportStart(date);
    }

    onInstructorReportDateEnd(date) {
        this.props.instructorAddReportEnd(date);
    }


    renderAdditionalForm() {
        const {buttonStyle} = styles;
        const {user, instructorCurrentDate} = this.props;
        if (this.props.showAddEvent) {
            this.updateEvents(user, instructorCurrentDate);
            return (
                <View styel={{flex: 1}}>
                    <DatePicker
                        style={{width: 200}}
                        date={this.props.instructorEventStart}
                        mode="datetime"
                        placeholder="Дата начала"
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
                        }}
                        onDateChange={this.onInstructorEventDateStart.bind(this)}
                    />
                    <DatePicker
                        style={{width: 200}}
                        date={this.props.instructorEventEnd}
                        mode="datetime"
                        placeholder="Дата начала"
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
                        }}
                        onDateChange={this.onInstructorEventDateEnd.bind(this)}
                    />
                    <Button
                        buttonStyle={buttonStyle}
                        raised
                        backgroundColor='#1668B5'
                        title='Сохранить'
                        onPress={() => this.onSaveEvent()}/>
                </View>
            )
        } else {
            return (<View/>)
        }
    }


    renderReportForm() {
        const {buttonStyle} = styles;
        if (this.props.showAddReport) {
            return (
                <View styel={{flex: 1}}>
                    <DatePicker
                        style={{width: 200}}
                        date={this.props.instructorReportStart}
                        mode="date"
                        placeholder="Дата начала"
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
                        }}
                        onDateChange={this.onInstructorReportDateStart.bind(this)}
                    />
                    <DatePicker
                        style={{width: 200}}
                        date={this.props.instructorReportEnd}
                        mode="date"
                        placeholder="Дата начала"
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
                        }}
                        onDateChange={this.onInstructorReportDateEnd.bind(this)}
                    />
                    <Button
                        buttonStyle={buttonStyle}
                        raised
                        backgroundColor='#1668B5'
                        title='Применить'
                        onPress={() => this.getReport()}/>
                </View>
            )
        } else {
            return (<View/>)
        }

    }


    renderReportOnSelectedDate() {
        const {id, events} = this.props.navigation.state.params;
        const {instructorEventsOnDate} = this.props;
        console.log("This is event on date", instructorEventsOnDate);
        if (instructorEventsOnDate.length > 0) {
            const {head, title, row, text, noDataText, table} = styles;
            const tableHead = ["Дата", "Время", "Тариф"];
            const indexes = [];
            const trainings = [];
            let count = 0;
            let arr = instructorEventsOnDate;
            console.log("This is event size ", arr.length);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].resource === id) {
                    console.log("This is matches", i);
                    indexes.push(count++);
                    let dateTime = arr[i].start.split(" ");
                    if (dateTime.length < 2) {
                        dateTime = arr[i].start.split("T");
                    }
                    trainings.push([dateTime[0], dateTime[1], arr[i].tarif_txt, arr[i].id, arr[i].own_client]);
                }
            }
            if (trainings.length > 0) {
                return (
                    <TableView>
                        <Section>
                            <TrainingCell name="Дата" title2="Время" title3="Тариф"/>
                            {trainings.map((training) => (
                                this.instructorTraining(training)
                            ))}
                        </Section>
                    </TableView>
                );
            } else {
                return (<Text style={noDataText}>Нет данных</Text>)
            }
        }

    }

    renderEvents() {
        const {id, events} = this.props.navigation.state.params;
        //
        // if (events.length > 0) {
        //     const {head, title, row, text, noDataText, table} = styles;
        //     const tableHead = [" ", "Дата", "Время", "Тариф"];
        //     const indexes = [];
        //     const trainings = [];
        //     let count = 0;
        //     let arr = events;
        //     console.log("This is event size ", arr.length);
        //     for (let i = 0; i < arr.length; i++) {
        //         if (arr[i].resource === id) {
        //             console.log("This is matches", i);
        //             indexes.push(count++);
        //             let dateTime = arr[i].start.split(" ");
        //             if (dateTime.length < 2) {
        //                 dateTime = arr[i].start.split("T");
        //             }
        //             trainings.push([dateTime[0], dateTime[1], arr[i].tarif_txt]);
        //         }
        //     }
        //
        //     if (trainings.length > 0) {
        //         return (
        //             <Table style={table}>
        //                 <Row data={tableHead} style={head} flexArr={[1, 3, 3, 3]} textStyle={text}/>
        //                 <TableWrapper style={{flexDirection: 'row'}}>
        //                     <Col data={indexes} style={styles.title} heightArr={[28, 28]} textStyle={styles.text}/>
        //                     <Rows data={trainings} flexArr={[3, 3, 3]} style={row} textStyle={styles.text}/>
        //                 </TableWrapper>
        //             </Table>
        //         );
        //     } else {
        //         return (<Text style={noDataText}>Нет данных</Text>)
        //     }
        // }

        //     if (trainings.length > 0) {
        //         return (
        //             <Table style={table}>
        //                 <Row data={tableHead} style={head} flexArr={[1, 3, 3, 3]} textStyle={text}/>
        //                 <TableWrapper style={{flexDirection: 'row'}}>
        //                     <Col data={indexes} style={styles.title} heightArr={[28, 28]} textStyle={styles.text}/>
        //                     <Rows data={trainings} flexArr={[3, 3, 3]} style={row} textStyle={styles.text}/>
        //                 </TableWrapper>
        //             </Table>
        //         );
        //     } else {
        //         return (<Text style={noDataText}>Нет данных</Text>)
        //     }


        if (events.length > 0) {
            const {head, title, row, text, noDataText, table} = styles;
            const tableHead = ["Дата", "Время", "Тариф"];
            const indexes = [];
            const trainings = [];
            let count = 0;
            let arr = events;
            console.log("This is event size ", arr.length);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].resource === id) {
                    console.log("This is matches", i);
                    indexes.push(count++);
                    let dateTime = arr[i].start.split(" ");
                    if (dateTime.length < 2) {
                        dateTime = arr[i].start.split("T");
                    }
                    trainings.push([dateTime[0], dateTime[1], arr[i].tarif_txt, arr[i].id, arr[i].own_client]);
                }
            }

            if (trainings.length > 0) {
                return (
                    <TableView>
                        <Section>
                            <TrainingCell name="Дата" title2="Время" title3="Тариф"/>
                            {trainings.map((training) => (
                                this.instructorTraining(training)
                            ))}
                        </Section>
                    </TableView>
                );
            } else {
                return (<Text style={noDataText}>Нет данных</Text>)
            }
        }


        // return (<Text>Нет данных</Text>)
    }

    makeCall = (phone) => {
        const args = {
            number: phone,
            prompt: true
        };

        call(args).catch(console.error)
    };

    getSpecialization() {
        const {board, ski} = this.props.navigation.state.params;
        if (board && ski) {
            return (<ListItem
                title="Виды спорта"
                rightTitleStyle={{color: '#000'}}
                rightTitle="Лыжи | Сноуборд"
                hideChevron
            />);
        } else if (ski) {
            return (<ListItem
                title="Виды спорта"
                rightTitle="Лыжи"
                rightTitleStyle={{color: '#000'}}
                hideChevron
            />);
        } else if (board) {
            return (<ListItem
                title="Виды спорта"
                rightTitle="Сноуборд"
                rightTitleStyle={{color: '#000'}}
                hideChevron
            />);
        }
    }


    // leftPressed() {
    //     const {instructorsCurrentDate} = this.props;
    //     this.props.changeDate(instructorsCurrentDate, "-");
    //     const {user} = this.props;
    //     this.props.getEventOnDate(user, instructorsCurrentDate);
    //     this.props.getTrainersAtWork(user, instructorsCurrentDate);
    // }
    //
    // rightPressed() {
    //     const {instructorsCurrentDate} = this.props;
    //     this.props.changeDate(instructorsCurrentDate, "+");
    //     const {user} = this.props;
    //     this.props.getEventOnDate(user, instructorsCurrentDate);
    //     this.props.getTrainersAtWork(user, instructorsCurrentDate);
    // }


    render() {
        const {name, phone, id, events, rating, board, ski} = this.props.navigation.state.params;
        const {buttonStyle} = styles;
        const {user, instructorCurrentDate} = this.props;
        if (this.props.reload) {
            this.updateEvents(user, instructorCurrentDate);
        }
        return (
            <ScrollView>
                <TopSlider
                    currentDate={this.props.instructorCurrentDate}
                    onLeftPressed={this.leftPressed.bind(this)}
                    onRightPressed={this.rightPressed.bind(this)}
                    onDateSelected={this.onDateChanged.bind(this)}
                />
                <List>
                    <ListItem
                        title="Имя"
                        rightTitle={name}
                        rightTitleStyle={{color: '#000'}}
                        hideChevron
                    />
                    <ListItem
                        title="Телефон"
                        rightTitle={phone}
                        onPress={() => this.makeCall(phone)}
                        rightTitleStyle={{color: '#6666FF'}}
                        hideChevron
                    />
                    <ListItem
                        title="Рейтинг"
                        rightTitle={rating}
                        rightTitleStyle={{color: '#000'}}
                        hideChevron
                    />
                    {this.getSpecialization()}
                </List>

                <Button
                    buttonStyle={buttonStyle}
                    raised
                    backgroundColor='#1668B5'
                    title='Добавить Занятие'
                    onPress={() => this.onAddEvent()}/>
                {this.renderAdditionalForm()}
                {/*{this.renderEvents()}*/}
                <Button
                    buttonStyle={buttonStyle}
                    raised
                    backgroundColor='#1668B5'
                    title='Отчет'
                    onPress={() => this.onShowReport()}/>
                {this.renderReportForm()}
                {this.renderReports()}
                {this.renderReportOnSelectedDate()}
            </ScrollView>
        );
    }


    renderTraining(training) {
        console.log("This is rendering trainings ", training);
        if (training.own_client) {
            return (
                <Cell
                    cellContentView={
                        <View
                            style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                training[0]
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                training[1]
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                training[2]
                            </Text>

                            <TouchableOpacity onPress={this.deleteEvent.bind(this, training[3])}>
                                <Icon name="close" size={20}/>
                            </TouchableOpacity>
                        </View>
                    }
                />
            );
        } else {
            return (
                <Cell
                    cellContentView={
                        <View
                            style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[0]}
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[1]}
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[2]}
                            </Text>
                        </View>
                    }
                />
            );
        }
    }
}

const CellVariant = (props) => (
    <Cell
        {...props}
        cellContentView={
            <View
                style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.name}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title2}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title3}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title4}
                </Text>
            </View>
        }
    />
);


const TrainingCell = (props) => (
    <Cell
        {...props}
        cellContentView={
            <View
                style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.name}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title2}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title3}
                </Text>
            </View>
        }
    />
);


const TrainingCell1 = (props) => (
    <Cell
        {...props}
        cellContentView={
            <View
                style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.name}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title2}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title3}
                </Text>

                <TouchableOpacity onPress={props.deleteEvent}>
                    <Icon name="close" size={20}/>
                </TouchableOpacity>
            </View>
        }
    />
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF'
    },
    head: {height: 40, backgroundColor: '#f1f8ff'},
    title: {flex: 1, backgroundColor: '#f6f8fa'},
    row: {height: 28},
    text: {textAlign: 'center'},
    noDataText: {textAlign: 'center', backgroundColor: '#FFF', paddingTop: 15, paddingBottom: 15},
    table: {flex: 1, backgroundColor: '#FFF', marginTop: 15},
    buttonStyle: {marginTop: 15, marginBottom: 15}
});


const mapStateToProps = ({instructorDetails, auth}) => {
    const {
        showAddEvent,
        instructorEventStart,
        instructorEventEnd,
        showAddReport,
        instructorReportStart,
        instructorReportEnd,
        reports,
        instructorCurrentDate,
        instructorEventsOnDate,
        reload
    } = instructorDetails;
    const {user} = auth;
    return {
        user,
        showAddEvent,
        instructorEventStart,
        instructorEventEnd,
        showAddReport,
        instructorReportStart,
        instructorReportEnd,
        reports,
        instructorCurrentDate,
        instructorEventsOnDate,
        reload
    }
};


export default connect(mapStateToProps, {
    instructorAddEvent,
    instructorAddEventStart,
    getReportOnSelectedDate,
    instructorAddEventEnd,
    getEventsOnSelectedDate,
    instructorShowReport,
    instructorAddEventToServer,
    instructorAddReportStart,
    instructorAddReportEnd,
    setInstructorCurrentDate,
    deleteEventFromServer,
    changeDate
})(InstructorsDetails);
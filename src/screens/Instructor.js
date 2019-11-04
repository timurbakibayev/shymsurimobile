import React from 'react';
import {Text, View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {TopSlider} from "../components/common/TopSlider";
import {Header} from "../components/common/Header";
import {List, ListItem, Button, SearchBar, CheckBox} from 'react-native-elements';
import {connect} from 'react-redux';
import {Spinner} from "../components/common/Spinner";
import DropdownMenu from "react-native-dropdown-menu";
import DatePicker from 'react-native-datepicker';
// import DatePicker from "react-native-modal-datetime-picker";
import {
    setCurrentDate,
    changeDate,
    getTrainers,
    instructorAddEvent,
    instructorShowReport,
    getEventOnSelectedDate,
    deleteEventFromServer,
    instructorAddReportStart,
    instructorAddReportEnd,
    getReportOnSelectedDate,
    instructorAddEventStart,
    instructorAddEventEnd,
    instructorAddEventToServer,
    setTrainerAtWork,
    setTrainerAtWorkOnServer,
    setLeftDate,
    setRightDate,
    getTrainerAtWorkFromServer,
    checkTrainerAtWork,
    instructorSki,
    instructorSnowboard,
} from '../actions/instructorAction';
import {logOut} from "../actions";
import {
    Cell,
    Section,
    TableView,
} from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import call from "react-native-phone-call";


class Instructor extends React.Component {

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
        this.props.setCurrentDate(currentDay);
        this.props.setLeftDate(currentDay);
        this.props.setRightDate(currentDay);
        // console.log("This is current date for instructor", currentDay);
        const {user} = this.props;
        this.props.getTrainers(user);
        this.props.getEventOnSelectedDate(user, currentDay);
        this.props.getTrainerAtWorkFromServer(user);
        // console.log("This is user", user, );
    }

    getSpecialization(instructor) {
        const {board, ski} = instructor;
        if (board && ski) {
            return (<ListItem
                title="Виды спорта"
                rightTitle="Лыжи | Сноуборд"
                rightTitleStyle={{color: '#000', fontSize: 16}}
                hideChevron
            />);
        } else if (ski) {
            return (<ListItem
                title="Виды спорта"
                rightTitle="Лыжи"
                rightTitleStyle={{color: '#000', fontSize: 16}}
                hideChevron
            />);
        } else if (board) {
            return (<ListItem
                title="Виды спорта"
                rightTitle="Сноуборд"
                rightTitleStyle={{color: '#000', fontSize: 16}}
                hideChevron
            />);
        }
    }

    makeCall = (phone) => {
        const args = {
            number: phone,
            prompt: true
        };

        call(args).catch(console.error)
    };

    onTrainerAtWorkChecked() {
        const {user, instructorCurrentDate, trainerAtWork} = this.props;
        this.props.setTrainerAtWork(trainerAtWork);
        this.props.setTrainerAtWorkOnServer(!trainerAtWork, user.trainers[0], instructorCurrentDate, user);
        this.props.getTrainerAtWorkFromServer(user);
    }

    leftPressed() {
        const {user, instructorCurrentDate, leftDate} = this.props;
        this.props.changeDate(instructorCurrentDate, "-");
        this.props.getEventOnSelectedDate(user, leftDate);
        this.props.setLeftDate(leftDate);
        this.props.setRightDate(leftDate);
        this.props.getTrainerAtWorkFromServer(user);
    }

    rightPressed() {
        const {user, instructorCurrentDate, rightDate} = this.props;
        this.props.changeDate(instructorCurrentDate, "+");
        this.props.getEventOnSelectedDate(user, rightDate);
        this.props.setLeftDate(rightDate);
        this.props.setRightDate(rightDate);
        this.props.getTrainerAtWorkFromServer(user);

    }

    onDateChanged(currentDay) {
        this.props.setCurrentDate(currentDay);
        const {user} = this.props;
        this.props.getEventOnSelectedDate(user, currentDay);
        this.props.getTrainerAtWorkFromServer(user);
    }

    updateEvents() {
        const {user, instructorCurrentDate} = this.props;
        console.log("This is the date", instructorCurrentDate);
        if (instructorCurrentDate) {
            this.props.getEventOnSelectedDate(user, instructorCurrentDate);
        }
    }

    logoutPressed() {
        console.log("This is logout");
        this.props.logOut();
    }

    // renderQueue(queue) {
    //     if (queue.length > 0) {
    //         return (<Text style={styles.queueText}>Номер вашей очереди {queue}</Text>);
    //     } else {
    //         return (<View/>);
    //     }
    // }

    render() {
        const {instructorLoadedTrainers, user, instructorCurrentDate, instructorAtWork} = this.props;
        console.log("this is loaded trainr and evnets ", instructorLoadedTrainers, instructorCurrentDate);
        if (this.props.reload) {
            console.log("I'm reloading");
            this.updateEvents(user, instructorCurrentDate);
        }
        if (instructorAtWork) {
            for (let i = 0; i < instructorAtWork.length; i++) {
                if (instructorCurrentDate === instructorAtWork[i].date) {
                    // console.log("This is instructor date and instructor at work date", instructorCurrentDate, instructorAtWork[i].date);
                    this.props.checkTrainerAtWork(instructorAtWork[i].at_work);
                }
            }
        }
        if (this.props.instructorDataLoading) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Spinner/>
                </View>
            )
        } else if (instructorLoadedTrainers) {
            let trainer;
            for (let i = 0; i < instructorLoadedTrainers.length; i++) {
                if (user.trainers[0] === instructorLoadedTrainers[i].id) {
                    trainer = instructorLoadedTrainers[i];
                }
            }
            const {name, phone, rating} = trainer;
            // console.log("This is data of trainer ", trainer);
            return (
                <ScrollView style={{marginTop: 15}}>
                    <Header headerText={"Shymbulak Ski & Snowboard School"}
                            onLogoutPressed={this.logoutPressed.bind(this)}
                    />
                    <TopSlider
                        currentDate={this.props.instructorCurrentDate}
                        onLeftPressed={this.leftPressed.bind(this)}
                        onRightPressed={this.rightPressed.bind(this)}
                        onDateSelected={this.onDateChanged.bind(this)}
                    />
                    <CheckBox
                        left
                        title='На Работе'
                        onPress={this.onTrainerAtWorkChecked.bind(this)}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={this.props.trainerAtWork}
                    />
                    {/*{this.renderQueue(trainer.queue)}*/}
                    <List>
                        <ListItem
                            title="Имя"
                            rightTitle={name}
                            hideChevron
                            rightTitleStyle={{color: '#000', fontSize: 16}}
                        />
                        <ListItem
                            title="Телефон"
                            rightTitle={phone}
                            onPress={() => this.makeCall(phone)}
                            rightTitleStyle={{color: '#6666FF', fontSize: 16}}
                            hideChevron
                        />
                        <ListItem
                            title="Рейтинг"
                            rightTitle={rating}
                            hideChevron
                            rightTitleStyle={{color: '#000', fontSize: 16}}
                        />
                        {this.getSpecialization(trainer)}
                    </List>

                    <Button
                        buttonStyle={styles.buttonStyle}
                        raised
                        backgroundColor='#1668B5'
                        title='Добавить Занятие'
                        onPress={() => this.onAddEvent()}
                    />
                    {this.renderAdditionalForm(trainer)}
                    {this.renderEvents(trainer)}
                    <Button
                        buttonStyle={styles.buttonStyle}
                        raised
                        backgroundColor='#1668B5'
                        title='Отчет'
                        onPress={() => this.onShowReport()}
                    />
                    {this.renderReportForm()}
                    {this.renderReports(trainer)}

                </ScrollView>
            )
        } else {
            return (
                <Text>This is the end</Text>
            )
        }
    }

    renderReports(instructor) {
        const {reports} = this.props;
        if (reports.length > 0) {
            return (
                <TableView>
                    <Section>
                        <CellVariant name="Забронировано" title2="Подтверждено" title3="Часы" title4="Начисленно"/>
                        {reports.map((report) => (
                            this.instructorReport(report, instructor)
                        ))}
                    </Section>
                </TableView>
            );
        } else {
            return (<View/>)
        }
    }

    instructorReport(report, instructor) {
        // console.log("This is rep element", report);
        const {id, name, rating} = instructor;
        if (id === report[0]) {
            return (
                <CellVariant name={report[1]}
                             title2={report[2]}
                             title3={report[3]}
                             title4={report[4]}/>
            )
        }
    }

    onInstructorSkiChecked() {
        this.props.instructorSki(this.props.instructorSkillSki);
    }

    onInstructorSnowboardChecked() {
        this.props.instructorSnowboard(this.props.instructorSkillSnowboard);
    }


    renderReportForm() {
        const {buttonStyle} = styles;
        if (this.props.instructorShowReportForm) {
            return (
                <View style={{flex: 1}}>
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

    onInstructorReportDateStart(date) {
        this.props.instructorAddReportStart(date);
    }

    onInstructorReportDateEnd(date) {
        this.props.instructorAddReportEnd(date);
    }

    renderEvents(trainer) {
        const {user, instructorCurrentDate, instructorEventSuccess} = this.props;
        // console.log("This is events", instructorEventSuccess);
        if (instructorEventSuccess.length > 0) {
            const indexes = [];
            const trainings = [];
            let count = 0;
            let arr = instructorEventSuccess;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].resource === trainer.id) {
                    indexes.push(count++);
                    let dateTime = arr[i].start.split(" ");
                    if (dateTime.length < 2) {
                        dateTime = arr[i].start.split("T");
                    }
                    let time = dateTime[1].split(":");

                    if (arr[i].end) {
                        let dateTime1 = arr[i].end.split(" ");
                        if (dateTime1.length < 2) {
                            dateTime1 = arr[i].end.split("T");
                        }
                        let time1 = dateTime1[1].split(":");
                        trainings.push([dateTime[0], time[0] + ":" + time[1] + "-" + time1[0] + ":" + time1[1], arr[i].ski, arr[i].tarif_txt, arr[i].id, arr[i].own_client]);
                    } else {
                        trainings.push([dateTime[0], time[0] + ":" + time[1], arr[i].ski, arr[i].tarif_txt, arr[i].id, arr[i].own_client]);
                    }
                }
            }

            if (trainings.length > 0) {
                return (
                    <TableView>
                        <Section>
                            <TrainingCell name="Дата" title2="Время" typeOfEquipment="Вид" title3="Тариф"/>
                            {trainings.map((training) => (
                                this.instructorTraining(training)
                            ))}
                        </Section>
                    </TableView>
                );
            }
            else {
                return (<Text style={styles.noDataText}>Нет данных</Text>)
            }
        }
    }

    renderAdditionalForm(trainer) {
        const {buttonStyle} = styles;
        const {instructorsCurrentDate, user} = this.props;
        let data = [["1 час", "1,5 часа", "2 часа"]];
        if (this.props.instructorShowAddEventForm) {
            // this.updateEvents(user, instructorsCurrentDate);
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
                    <View style={{flex: 1, marginBottom: 120}}>

                        <DropdownMenu style={{flex: 1}}

                                      bgColor={"#1668B5"}
                                      tintColor={"white"}
                                      selectItemColor={"#1668B5"}
                                      data={data}
                                      maxHeight={410}
                            //              handler={(selection, row) => alert(data[selection][row])}
                            //           handler={(selection, row) => console.log("This is selection", selection, row)}
                                      handler={(selection, row) => this.onInstructorEventDateEnd(row)}
                        >
                            {/*<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>*/}
                            {/*<Text>*/}
                            {/*Your own view Here*/}
                            {/*</Text>*/}
                            {/*</View>*/}
                            <View>
                                <CheckBox
                                    left
                                    title='Лыжи'
                                    onPress={this.onInstructorSkiChecked.bind(this)}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.props.instructorSkillSki}
                                />
                                <CheckBox
                                    left
                                    title='Сноуборд'
                                    onPress={this.onInstructorSnowboardChecked.bind(this)}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.props.instructorSkillSnowboard}
                                />
                            </View>

                        </DropdownMenu>
                    </View>

                    <Button
                        buttonStyle={buttonStyle}
                        raised
                        backgroundColor='#1668B5'
                        title='Сохранить'
                        onPress={() => this.onSaveEvent(trainer)}/>
                </View>
            )
        } else {
            return (<View/>)
        }
    }

    onSaveEvent = (instructor) => {
        const {user, showAddEvent, instructorEventStart, instructorEventEnd, instructorSkillSki, instructorSkillSnowboard} = this.props;
        const {id, name, rating} = instructor;
        // console.log("All about instructor", id + " " + name + " " + rating + " " + user.token);
        // console.log("This is event to save ", instructorEventStart + " " + instructorEventEnd);
        this.props.instructorAddEventToServer({
            user,
            id,
            name,
            rating,
            instructorEventStart,
            instructorEventEnd,
            instructorSkillSki,
            instructorSkillSnowboard
        });
    };

    onInstructorEventDateStart(date) {
        this.props.instructorAddEventStart(date);
    }

    onInstructorEventDateEnd(time) {
        if (time === 1) {
            this.props.instructorAddEventEnd(1.5);
        } else if (time === 2) {
            this.props.instructorAddEventEnd(2);
        } else {
            this.props.instructorAddEventEnd(1);
        }
    }

    onAddEvent = () => {
        this.props.instructorAddEvent();
    };

    onShowReport = () => {
        this.props.instructorShowReport();
    };

    getReport = () => {
        const {user, instructorReportStart, instructorReportEnd} = this.props;
        // console.log("This is report info ", user.token, instructorReportStart, instructorReportEnd);
        this.props.getReportOnSelectedDate(user, instructorReportStart, instructorReportEnd)
    };

    deleteEvent = (id) => {
        const {user} = this.props;
        console.log("This is user and id ", user.token, id);
        this.props.deleteEventFromServer(user, id);
    };

    renderEquipment(euqipment) {
        if (euqipment) {
            return "S";
        } else {
            return "B";
        }
    }

    instructorTraining(training) {
        if (training[5]) {
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
                                    this.renderEquipment(training[2])
                                }
                            </Text>
                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {
                                    training[3]
                                }
                            </Text>

                            <TouchableOpacity onPress={this.deleteEvent.bind(this, training[4])}>
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
                                {
                                    this.renderEquipment(training[2])
                                }
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                                {training[3]}
                            </Text>
                        </View>
                    }
                />
            );
        }
    }
}

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
                    {props.typeOfEquipment}
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF'
    },
    head: {height: 40, backgroundColor: '#f1f8ff'},
    title: {flex: 1, backgroundColor: '#f6f8fa'},
    row: {height: 28},
    text: {textAlign: 'center'},
    noDataText: {textAlign: 'center', backgroundColor: '#FFF', paddingTop: 15, paddingBottom: 15},
    queueText: {
        textAlign: 'center',
        backgroundColor: '#FFF',
        color: '#388E3C',
        paddingTop: 15,
        paddingBottom: 15,
        fontWeight: '600'
    },
    table: {flex: 1, backgroundColor: '#FFF', marginTop: 15},
    buttonStyle: {marginTop: 15, marginBottom: 15}
});

const mapStateToProps = ({auth, instructorReducer}) => {
    const {isLoggedIn, user} = auth;
    const {
        instructorCurrentDate,
        instructorDataLoading,
        instructorLoadedTrainers,
        instructorShowAddEventForm,
        instructorEventSuccess,
        reload,
        instructorShowReportForm,
        instructorReportStart,
        instructorReportEnd,
        reports,
        instructorEventStart,
        instructorEventEnd,
        trainerAtWork,
        leftDate,
        rightDate,
        instructorAtWork,
        instructorSkillSki,
        instructorSkillSnowboard
    } = instructorReducer;
    return {
        isLoggedIn,
        user,
        instructorCurrentDate,
        instructorDataLoading,
        instructorLoadedTrainers,
        instructorShowAddEventForm,
        instructorEventSuccess,
        reload,
        instructorShowReportForm,
        instructorReportStart,
        instructorReportEnd,
        reports,
        instructorEventStart,
        instructorEventEnd,
        trainerAtWork,
        leftDate,
        rightDate,
        instructorAtWork,
        instructorSkillSki,
        instructorSkillSnowboard
    };
};

export default connect(mapStateToProps, {
    setCurrentDate,
    changeDate,
    getTrainers,
    instructorAddEvent,
    instructorShowReport,
    getEventOnSelectedDate,
    deleteEventFromServer,
    instructorAddReportStart,
    instructorAddReportEnd,
    getReportOnSelectedDate,
    instructorAddEventStart,
    instructorAddEventEnd,
    instructorAddEventToServer,
    setTrainerAtWork,
    setTrainerAtWorkOnServer,
    setLeftDate,
    setRightDate,
    logOut,
    getTrainerAtWorkFromServer,
    checkTrainerAtWork,
    instructorSki,
    instructorSnowboard,
})(Instructor);

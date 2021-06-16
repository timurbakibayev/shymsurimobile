import React from 'react';
import {
    Text,
    ScrollView,
    View,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Picker, Image, TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {List, ListItem, Button, SearchBar, CheckBox} from 'react-native-elements';
import {connect} from 'react-redux';
import DatePicker from 'react-native-datepicker';
import DropdownMenu from "react-native-dropdown-menu";
import {
    getTrainers,
    getEvents,
    getTrainersAtWork,
    setTrainerAtWork,
    setTrainerAtWorkOnServer,
    // getCurrentEvents,
    instructorShowReport,
    instructorAddEvent,
    instructorAddEventStart,
    instructorAddEventStartTime,
    instructorAddEventEnd,
    instructorAddReportStart,
    instructorAddReportEnd,
    addInstructor,
    setCurrentDate,
    changeDate,
    getEventOnDate,
    searchingFor,
    instructorAddEventToServer,
    getReportOnSelectedDate,
    getNotificationText,
    deleteEventFromServer,
    instructorChangeScreen,
    returnToInstructor,
    setLeftDate,
    setRightDate,
    instructorSki,
    instructorSnowboard
} from "../actions/users";
import {logOut} from "../actions";
import { Appearance } from 'react-native-appearance';


import call from 'react-native-phone-call';
import {TopSlider} from "../components/common";
import {Spinner} from "../components/common/Spinner";
import PTRView from 'react-native-pull-to-refresh'
import {
    Cell,
    Section,
    TableView,
} from 'react-native-tableview-simple';
import {
    Notifications,
} from 'expo';
import {Header} from "../components/common/Header";
import {URL} from "../const";

class Instructors extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filterText: '',
            duration: 1,
        };

    }

    onLearnMore = (instructor, events) => {
        this.props.navigation.navigate('Details', {...instructor, events});
    };

    componentDidMount() {

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;

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
        const {user} = this.props;
        this.updateEvents(user, currentDay);
        this.updateTrainers(user, currentDay);
        let token = user.token;
        this.props.getTrainers({token});

        Notifications._notificationSubscription = Notifications.addListener(this._handleNotification);

        this.props.instructorAddEventStart(currentDay);
        this.props.instructorAddEventStartTime("14:00:00");
        this.props.instructorAddEventEnd(1);
        this.setState({duration:1});
        this.props.instructorAddReportStart(currentDay);
        this.props.instructorAddReportEnd(currentDay);
    }

    updateEvents(user, currentDay) {
        this.props.getEventOnDate(user, currentDay);
    }

    changeScreen(choosenTrainer) {
        this.props.instructorChangeScreen(choosenTrainer);
    }

    updateTrainers(user, currentDay) {
        this.props.getTrainersAtWork(user, currentDay);
    }


    _handleNotification = (notification) => {
        this.props.getNotificationText(notification);
        const {instructorsCurrentDate, user} = this.props;
        this.updateEvents(user, instructorsCurrentDate);
        this.updateTrainers(user, instructorsCurrentDate);
    };

    onAddEvent = () => {
        this.props.instructorAddEvent();
    };

    onShowReport = () => {
        this.props.instructorShowReport();
    };

    onInstructorReportDateStart(date) {
        this.props.instructorAddReportStart(date);
    }

    onInstructorReportDateEnd(date) {
        this.props.instructorAddReportEnd(date);
    }

    listItemWithIcon(instructor) {
        if (this.props.events) {
            let arr = this.props.events;
            let count = 0;
            let color = "";

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].resource === instructor.id) {
                    count++;
                }
            }

            if (instructor.at_work) {
                color = "#1B5E20";
            } else {
                color = "#B71C1C";

            }

            if (count > 0 && instructor.photo !== 'none') {
                let photoUrl = URL + instructor.photo;
                return (
                    <ListItem
                        roundAvatar
                        avatar={{uri: photoUrl}}
                        key={instructor.id}
                        chevronColor={color}
                        title={instructor.name}
                        subtitle={instructor.phone}
                        badge={
                            {
                                value: count, textStyle: {color: '#FFF'},
                                containerStyle: {marginTop: 5, backgroundColor: '#1668B5'}
                            }
                        }
                        onPress={() => this.changeScreen(instructor)}
                    />
                );
            } else if (count > 0 && instructor.photo === 'none') {
                return (
                    <ListItem
                        leftIcon={{name: 'person'}}
                        key={instructor.id}
                        title={instructor.name}
                        subtitle={instructor.phone}
                        chevronColor={color}
                        badge={
                            {
                                value: count, textStyle: {color: '#FFF'},
                                containerStyle: {marginTop: 5, backgroundColor: '#1668B5'}
                            }
                        }
                        onPress={() => this.changeScreen(instructor)}
                    />
                );
            } else if (count === 0 && instructor.photo !== 'none') {
                let photoUrl = URL + instructor.photo;
                return (<ListItem
                    roundAvatar
                    chevronColor={color}
                    avatar={{uri: photoUrl}}
                    key={instructor.id}
                    title={instructor.name}
                    subtitle={instructor.phone}
                    onPress={() => this.changeScreen(instructor)}
                />);
            } else {
                return (
                    <ListItem
                        leftIcon={{name: 'person'}}
                        chevronColor={color}
                        key={instructor.id}
                        title={instructor.name}
                        subtitle={instructor.phone}
                        onPress={() => this.changeScreen(instructor)}
                        // onPress={() => this.onLearnMore(instructor, this.props.events)}
                    />
                )
            }
        }

    }


    sortedInstructors() {
        const {trainersAtWork, events} = this.props;
        let instructorsAtWork = [];
        let instructorsNotAtWork = [];
        for (let i = 0; i < trainersAtWork.length; i++) {
            if (trainersAtWork[i].at_work) {
                if (this.state.filterText === '' || trainersAtWork[i].name.toUpperCase().includes(this.state.filterText.toUpperCase()))
                    instructorsAtWork.push(trainersAtWork[i]);
            }
        }

        for (let i = 0; i < trainersAtWork.length; i++) {
            if (!trainersAtWork[i].at_work) {
                if (this.state.filterText === '' || trainersAtWork[i].name.toUpperCase().includes(this.state.filterText.toUpperCase()))
                    instructorsNotAtWork.push(trainersAtWork[i]);
            }
        }
        return (
            <View>
                <List>
                    {instructorsAtWork.map((instructor) => (
                        this.listItemWithIcon(instructor)
                    ))}
                </List>
                <List>
                    {instructorsNotAtWork.map((instructor) => (
                        this.listItemWithIcon(instructor)
                    ))}
                </List>
            </View>
        )
    }

    foundUser() {
        const {trainersAtWork, lookingFor} = this.props;
        let foundTrainers = [];
        if (trainersAtWork && lookingFor) {
            for (let i = 0; i < trainersAtWork.length; i++) {
                if (trainersAtWork[i].name.includes(lookingFor)) {
                    foundTrainers.push(trainersAtWork[i]);
                }
            }
        }

        if (foundTrainers.length > 0) {
            return (
                <View>
                    <List>
                        {foundTrainers.map((instructor) => (
                            this.listItemWithIcon(instructor)
                        ))}
                    </List>
                </View>
            )
        } else {
            return (<View/>)
        }

    }


    leftPressed() {
        const {instructorsCurrentDate, leftDate} = this.props;
        this.props.changeDate(instructorsCurrentDate, "-");
        const {user} = this.props;
        this.props.getEventOnDate(user, leftDate);
        this.props.getTrainersAtWork(user, leftDate);
        this.props.setLeftDate(leftDate);
        this.props.setRightDate(leftDate);
        this.props.instructorAddEventStart(leftDate);
        this.props.instructorAddReportStart(leftDate);
        this.props.instructorAddReportEnd(leftDate);
    }

    rightPressed() {
        const {instructorsCurrentDate, rightDate} = this.props;
        this.props.changeDate(instructorsCurrentDate, "+");
        const {user} = this.props;
        this.props.getEventOnDate(user, rightDate);
        this.props.getTrainersAtWork(user, rightDate);
        this.props.setLeftDate(rightDate);
        this.props.setRightDate(rightDate);
        this.props.instructorAddEventStart(rightDate);
        this.props.instructorAddReportStart(rightDate);
        this.props.instructorAddReportEnd(rightDate);
    }

    onDateChanged(currentDay) {
        this.props.setCurrentDate(currentDay);
        const {user} = this.props;
        this.props.getEventOnDate(user, currentDay);
        this.props.getTrainersAtWork(user, currentDay);
        this.props.instructorAddEventStart(currentDay);
        this.props.instructorAddReportStart(currentDay);
        this.props.instructorAddReportEnd(currentDay);
        console.log(this.props.leftDate,currentDay,this.props.rightDate,)
    }

    someMethod(text) {
        // this.props.searchingFor(text);
        this.setState({filterText: text})
    }

    getSpecialization(instructor) {
        const {board, ski} = instructor;
        if (board && ski) {
            return (<ListItem
                title="Виды спорта"
                rightTitle="Лыжи | Сноуборд"
                rightTitleStyle={{color: '#000'}}
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

    getSpecializationText(instructor) {
        const {board, ski} = instructor;
        if (board && ski)
            return "Лыжи и Сноуборд";
        if (ski)
            return "Лыжи";
        if (board)
            return "Сноуборд";
    }


    makeCall = (phone) => {
        const args = {
            number: phone,
            prompt: true
        };

        call(args).catch(console.error)
    };

    onTrainerAtWorkChecked() {
        const {user, instructorsCurrentDate, trainerAtWork} = this.props;
        // console.log("Trainer at Work", trainerAtWork);
        this.props.setTrainerAtWork(trainerAtWork);
        // console.log("This is user", user);
        this.props.setTrainerAtWorkOnServer(!trainerAtWork, user.trainers[0], instructorsCurrentDate, user)
    }

    returnToPreviousScreen() {
        this.props.returnToInstructor();
    }

    logoutPressed() {
        // console.log("This is logout in instructors");
        this.props.logOut();
    }


    renderUser() {
        // console.log("This is renderUser");
        const {user, instructors, events, trainer} = this.props;
        // console.log("This is trainer id", trainer.id);
        // if (user.role === "trainer" && instructors) {
        if (trainer && instructors) {
            for (let i = 0; i < instructors.length; i++) {
                if (trainer.id === instructors[i].id) {
                    // console.log("this is trainer ", instructors[i]);
                    let instructor = instructors[i];
                    // this.onLearnMore(instructor, events);
                    const {name, phone, rating, photo} = instructor;
                    return (
                        <ScrollView>
                            <Header onReturnPressed={this.returnToPreviousScreen.bind(this)}
                                    onLogoutPressed={this.logoutPressed.bind(this)}
                                    headerText={"Shymbulak Ski & Snowboard School"}/>
                                    <View style={{ alignItems: 'center', margin: 10}}>
                                    <View style={{width: 60, height: 60, borderRadius: 50, overflow: 'hidden'}}>
                                        <Image style={{width: 60, height: 60}} source={{uri: `https://instructor-shym.kz${photo}`}}/>
                                    </View>
                                    </View>
                            <TopSlider
                                currentDate={this.props.instructorsCurrentDate}
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
                    <List>
                        <ListItem
                            title={`${trainer.name}`}
                            hideChevron
                            rightTitleStyle={{color: '#000', fontSize: 16}}
                        />
                        <ListItem
                            title={`${phone}`}
                            onPress={() => this.makeCall(phone)}
                            hideChevron
                            rightTitleStyle={{color: '#000', fontSize: 16}}
                        />
                        <ListItem
                            title={`Рейтинг: ${rating},  ` + this.getSpecializationText(trainer)}
                            hideChevron
                            rightTitleStyle={{color: '#000', fontSize: 16}}
                        />
                    </List>
                            <Button
                                buttonStyle={styles.buttonStyle}
                                raised
                                backgroundColor='#1668B5'
                                title='Добавить Занятие'
                                onPress={() => this.onAddEvent()}/>
                            {this.renderAdditionalForm(instructor)}
                            {this.renderEvents(instructor)}
                            <Button
                                buttonStyle={styles.buttonStyle}
                                raised
                                backgroundColor='#1668B5'
                                title='Отчет'
                                onPress={() => this.onShowReport()}/>
                            {this.renderReportForm()}
                            {this.renderReports(instructor)}
                            {/*{this.renderReportOnSelectedDate()}*/}
                            <View style={{ alignItems: 'center', marginBottom: 200}}/>
                        </ScrollView>
                    );
                }
            }
        }

    }


    renderEvents(instructor) {
        const {events} = this.props;
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
            // console.log("This is event size ", arr.length);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].resource === instructor.id) {
                    // console.log("This is matches", i);
                    indexes.push(count++);
                    let dateTime = arr[i].start.split(" ");
                    if (dateTime.length < 2) {
                        dateTime = arr[i].start.split("T");
                    }

                    let time = dateTime[1].split(":");

                    // console.log("this is end time", arr[i].end);
                    if (arr[i].end) {
                        let dateTime1 = arr[i].end.split(" ");
                        if (dateTime1.length < 2) {
                            dateTime1 = arr[i].end.split("T");
                        }
                        let time1 = dateTime1[1].split(":");
                        trainings.push([dateTime[0], time[0] + ":" + time[1] + "-" + time1[0] + ":" + time1[1], arr[i].ski, arr[i].tarif_txt, arr[i].id, arr[i].own_client, arr[i].is_booked_online]);
                    } else {
                        trainings.push([dateTime[0], time[0] + ":" + time[1], arr[i].ski, arr[i].tarif_txt, arr[i].id, arr[i].own_client, arr[i].is_booked_online]);
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
            } else {
                return (<Text style={noDataText}>Нет данных</Text>)
            }
        }


        // return (<Text>Нет данных</Text>)
    }


    // instructorTraining(training) {
    //     // return (
    //     //     <TrainingCell name={training[0]}
    //     //                   title2={training[1]}
    //     //                   title3={training[2]}
    //     //     />
    //     // )
    //
    //
    // }

    renderEquipment(euqipment) {
        if (euqipment) {
            return "S";
        } else {
            return "B";
        }
    }

    instructorTraining(training) {
        // console.log("this is training ", training);
        // console.log("This is own client", training[4]);
        if (training[5]) {
            return (
                <Cell key={training[0]+training[1]}
                    cellContentView={
                        <View
                            style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>
                            <View style={{flexDirection: 'column'}}>
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
                            </View>

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
                <Cell key={training[0]+training[1]}
                    cellContentView={
                        <View
                            style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>
                            <View style={{flexDirection: 'column'}}>
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
                            </View>

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
                            {training[6] && <Icon name="wallet" size={20}/> }
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
                <CellVariant key={`${report[1]}-${report[2]}-${report[3]}`} name={report[1]}
                             title2={report[2]}
                             title3={report[3]}
                             title4={report[4]}/>
            )
        }
    }

    renderReportOnSelectedDate() {
        const {id, events} = this.props;
        const {instructorEventsOnDate} = this.props;
        // console.log("This is event on date", instructorEventsOnDate);
        if (instructorEventsOnDate.length > 0) {
            const {head, title, row, text, noDataText, table} = styles;
            const tableHead = ["Дата", "Время", "Тариф"];
            const indexes = [];
            const trainings = [];
            let count = 0;
            let arr = instructorEventsOnDate;
            // console.log("This is event size ", arr.length);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].resource === id) {
                    // console.log("This is matches", i);
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

    renderReportForm() {
        const {buttonStyle} = styles;
        let colorScheme = Appearance.getColorScheme();
        let bgcolor = '#FFF';
        if (colorScheme === 'dark') {
            bgcolor = '#000';
        };
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
                            datePickerCon: {backgroundColor: bgcolor},
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
                        placeholder="Дата конца"
                        format="YYYY-MM-DD"
                        minDate="2016-05-01"
                        // maxDate="2017-12-31"
                        confirmBtnText="Подтвердить"
                        cancelBtnText="Отмена"
                        customStyles={{
                            datePickerCon: {backgroundColor: bgcolor},
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


    // renderEvents() {
    //     // const {id, events} = this.props.navigation.state.params;
    //     //
    //     // if (events.length > 0) {
    //     //     const {head, title, row, text, noDataText, table} = styles;
    //     //     const tableHead = [" ", "Дата", "Время", "Тариф"];
    //     //     const indexes = [];
    //     //     const trainings = [];
    //     //     let count = 0;
    //     //     let arr = events;
    //     //     console.log("This is event size ", arr.length);
    //     //     for (let i = 0; i < arr.length; i++) {
    //     //         if (arr[i].resource === id) {
    //     //             console.log("This is matches", i);
    //     //             indexes.push(count++);
    //     //             let dateTime = arr[i].start.split(" ");
    //     //             if (dateTime.length < 2) {
    //     //                 dateTime = arr[i].start.split("T");
    //     //             }
    //     //             trainings.push([dateTime[0], dateTime[1], arr[i].tarif_txt]);
    //     //         }
    //     //     }
    //     //
    //     //     if (trainings.length > 0) {
    //     //         return (
    //     //             <Table style={table}>
    //     //                 <Row data={tableHead} style={head} flexArr={[1, 3, 3, 3]} textStyle={text}/>
    //     //                 <TableWrapper style={{flexDirection: 'row'}}>
    //     //                     <Col data={indexes} style={styles.title} heightArr={[28, 28]} textStyle={styles.text}/>
    //     //                     <Rows data={trainings} flexArr={[3, 3, 3]} style={row} textStyle={styles.text}/>
    //     //                 </TableWrapper>
    //     //             </Table>
    //     //         );
    //     //     } else {
    //     //         return (<Text style={noDataText}>Нет данных</Text>)
    //     //     }
    //     // }
    //
    //     //     if (trainings.length > 0) {
    //     //         return (
    //     //             <Table style={table}>
    //     //                 <Row data={tableHead} style={head} flexArr={[1, 3, 3, 3]} textStyle={text}/>
    //     //                 <TableWrapper style={{flexDirection: 'row'}}>
    //     //                     <Col data={indexes} style={styles.title} heightArr={[28, 28]} textStyle={styles.text}/>
    //     //                     <Rows data={trainings} flexArr={[3, 3, 3]} style={row} textStyle={styles.text}/>
    //     //                 </TableWrapper>
    //     //             </Table>
    //     //         );
    //     //     } else {
    //     //         return (<Text style={noDataText}>Нет данных</Text>)
    //     //     }
    //
    //     const {events} = this.props;
    //     if (events.length > 0) {
    //         const {head, title, row, text, noDataText, table} = styles;
    //         const tableHead = ["Дата", "Время", "Тариф"];
    //         const indexes = [];
    //         const trainings = [];
    //         let count = 0;
    //         let arr = events;
    //         console.log("This is event size ", arr.length);
    //         for (let i = 0; i < arr.length; i++) {
    //             if (arr[i].resource === id) {
    //                 console.log("This is matches", i);
    //                 indexes.push(count++);
    //                 let dateTime = arr[i].start.split(" ");
    //                 if (dateTime.length < 2) {
    //                     dateTime = arr[i].start.split("T");
    //                 }
    //                 trainings.push([dateTime[0], dateTime[1], arr[i].tarif_txt]);
    //             }
    //         }
    //
    //         if (trainings.length > 0) {
    //             return (
    //                 <TableView>
    //                     <Section>
    //                         <TrainingCell name="Дата" title2="Время" title3="Тариф"/>
    //                         {trainings.map((training) => (
    //                             this.instructorTraining(training)
    //                         ))}
    //                     </Section>
    //                 </TableView>
    //             );
    //         } else {
    //             return (<Text style={noDataText}>Нет данных</Text>)
    //         }
    //     }
    //
    //
    //     // return (<Text>Нет данных</Text>)
    // }

    onInstructorEventDateStartTime(time) {
        console.log(time);
        this.props.instructorAddEventStartTime(`${time}:00`);
    }

    onInstructorEventDateStart(date) {
        this.props.instructorAddEventStart(date);
    }

    onInstructorEventDateEnd(time) {
        if (time === 1.5) {
            this.props.instructorAddEventEnd(1.5);
            this.setState({duration:1.5});
        } else if (time === 2) {
            this.props.instructorAddEventEnd(2);
            this.setState({duration:2});
        } else {
            this.props.instructorAddEventEnd(1);
            this.setState({duration:1});
        }
    }


    renderAdditionalForm(instructor) {
        const {buttonStyle} = styles;
        const {instructorsCurrentDate, user} = this.props;
        let colorScheme = Appearance.getColorScheme();
        let bgcolor = '#FFF';
        if (colorScheme === 'dark') {
            bgcolor = '#000';
        };
        if (this.props.showAddEvent) {
            // this.updateEvents(user, instructorsCurrentDate);
            return (
                <View style={{flex: 1, margin: 10, borderStyle: 'solid', borderRadius: 10, borderColor: '#CCCCCC',
                                borderWidth: 2, padding: 10, alignItems: 'center'}}>
                     <Text style={{textAlign: 'center', alignItems: 'center'}}>
                        Новое занятие:
                    </Text>
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center",
                        paddingRight: 10,
                    }}>
                    <TextInput
                        style={{height: 40, width: 80,paddingLeft: 10,  fontSize: 20, border: "#AAAAAA", borderStyle: "solid", borderWidth: 1}}
                        placeholder="Время начала занятия"
                        onChangeText={(text) => {
                            this.onInstructorEventDateStartTime(text)}}
                        defaultValue={"14:00"}
                    />
                    </View>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
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

                    <Text style={{textAlign: 'center', alignItems: 'center'}}>
                        Продолжительность:
                    </Text>
                        <CheckBox
                                    left
                                    title='1 час'
                                    onPress={()=>this.onInstructorEventDateEnd(1)}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.duration===1}
                                />
                        <CheckBox
                                    left
                                    title='1.5 часа'
                                    onPress={()=>this.onInstructorEventDateEnd(1.5)}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.duration===1.5}
                                />
                        <CheckBox
                                    left
                                    title='2 часа'
                                    onPress={()=>this.onInstructorEventDateEnd(2)}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.duration===2}
                                />

                    <Button
                        buttonStyle={buttonStyle}
                        raised
                        backgroundColor='#1668B5'
                        title='Сохранить'
                        onPress={() => this.onSaveEvent(instructor)}/>
                </View>
                </View>
            )
        } else {
            return (<View/>)
        }
    }

    deleteEvent = (id) => {
        const {user} = this.props;
        // console.log("This is user and id ", user.token, id);
        this.props.deleteEventFromServer(user, id);
    };

    onSaveEvent = (instructor) => {
        const {user, showAddEvent, text, instructorEventStartTime, instructorEventStartDate,  instructorEventEnd, instructorSkillSki, instructorSkillSnowboard} = this.props;
        const {id, name, rating} = instructor;
        // console.log("All about instructor", id + " " + name + " " + rating + " " + user.token);
        // console.log("This is event to save ", instructorEventStart + " " + instructorEventEnd);
        this.props.instructorAddEventToServer({
            user,
            id,
            name,
            rating,
            text,
            instructorEventStartDate,
            instructorEventStartTime,
            instructorEventEnd,
            instructorSkillSki,
            instructorSkillSnowboard
        });
    };

    getReport = () => {
        const {user, instructorReportStart, instructorReportEnd} = this.props;
        // console.log("This is report info ", user.token, instructorReportStart, instructorReportEnd);
        this.props.getReportOnSelectedDate(user, instructorReportStart, instructorReportEnd)
    };

    refresh() {
        // Alert.alert("Time", "title");
        console.log("Inside of refresh");
        const {user, instructorCurrentDate} = this.props;
        this.props.getEventOnDate(user, instructorCurrentDate);
        this.props.getTrainersAtWork(user, instructorCurrentDate);
    }

    findUser(text) {
        const {trainersAtWork} = this.props;
        let instructorsAtWork = [];
        // console.log("This is text and this is instructors", text, trainersAtWork);
        if (trainersAtWork) {
            for (let i = 0; i < trainersAtWork.length; i++) {
                if (trainersAtWork[i].name.includes(text)) {
                    // console.log("This is trainer ", trainersAtWork[i]);
                }
            }
        }
    }

    onInstructorSkiChecked() {
        this.props.instructorSki(this.props.instructorSkillSki);
    }

    onInstructorSnowboardChecked() {
        this.props.instructorSnowboard(this.props.instructorSkillSnowboard);
    }

    render() {
        const {notification} = this.props;
        const {instructorsCurrentDate, user} = this.props;
        // if (this.props.trainer) {
        //     this.renderUser();
        // }
        if (this.props.reload) {
            this.updateEvents(user, instructorsCurrentDate);
        }

        if (this.props.usersLoading) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Spinner/>
                </View>
            );
        }
        if (notification) {
            return (
                <View>
                    <Text>{notification.origin}</Text>
                    <Text>{notification.data}</Text>
                </View>
            )
        }
        const {lookingFor} = this.props;
        // console.log("This is user role in render", user.role);
        if (lookingFor) {
            this.findUser(lookingFor);
        }
        if (this.props.trainer) {
            return (
                <View>
                    {this.renderUser()}
                </View>
            );
        } else if (user.role !== "trainer" && this.props.trainersAtWork) {
            return (
                <PTRView onRefresh={this.refresh}>
                    <ScrollView>
                        <Header headerText={"Shymbulak Ski & Snowboard School"}
                                onLogoutPressed={this.logoutPressed.bind(this)}
                        />
                        <SearchBar
                            containerStyle={{backgroundColor: "#FFF"}}
                            inputStyle={{backgroundColor: '#FFF'}}
                            icon={{size: 20}}
                            lightTheme
                            autoCorrect={false}
                            autoCapitalize='words'
                            onChangeText={this.someMethod.bind(this)}
                            placeholder='Найти инструктора...'/>
                        <TopSlider currentDate={this.props.instructorsCurrentDate}
                                   onLeftPressed={this.leftPressed.bind(this)}
                                   onRightPressed={this.rightPressed.bind(this)}
                                   onDateSelected={this.onDateChanged.bind(this)}
                        />
                        {this.foundUser()}
                        {this.sortedInstructors()}
                    </ScrollView>
                </PTRView>
            );
        } else if (this.props.usersLoading) {
            return (<Spinner size='large'/>);
        } else {
            return (<Text>No worries</Text>)
        }

        //TODO check date with of instructor and event
    }
}

const mapStateToProps = ({users, auth}) => {
    const {
        instructors,
        instructorError,
        events,
        usersLoading,
        instructorsCurrentDate,
        trainersAtWork,
        lookingFor,
        showAddEvent,
        showAddReport,
        instructorReportStart,
        instructorReportEnd,
        instructorCurrentDate,
        instructorEventsOnDate,
        text,
        instructorEventStartDate,
        instructorEventStartTime,
        instructorEventEnd,
        reports,
        notification,
        reload,
        trainerAtWork,
        trainer,
        leftDate,
        rightDate,
        instructorSkillSki,
        instructorSkillSnowboard
    } = users;
    const {user} = auth;
    return {
        instructors,
        instructorError,
        user,
        events,
        usersLoading,
        instructorsCurrentDate,
        trainersAtWork,
        lookingFor,
        showAddEvent,
        showAddReport,
        instructorReportStart,
        instructorReportEnd,
        instructorEventEnd,
        instructorCurrentDate,
        instructorEventsOnDate,
        text,
        instructorEventStartDate,
        instructorEventStartTime,
        reports,
        notification,
        reload,
        trainerAtWork,
        trainer,
        leftDate,
        rightDate,
        instructorSkillSki,
        instructorSkillSnowboard
    }
};


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
    table: {flex: 1, backgroundColor: '#FFF', marginTop: 15},
    buttonStyle: {marginTop: 15, marginBottom: 15}
});


export default connect(mapStateToProps, {
    getTrainers,
    getEvents,
    instructorChangeScreen,
    getTrainersAtWork,
    instructorAddEvent,
    instructorShowReport,
    instructorAddReportStart,
    instructorAddReportEnd,
    setTrainerAtWork,
    setTrainerAtWorkOnServer,
    returnToInstructor,
    // getCurrentEvents,
    logOut,
    instructorAddEventStart,
    instructorAddEventStartTime,
    instructorAddEventEnd,
    addInstructor,
    setCurrentDate,
    changeDate,
    getEventOnDate,
    searchingFor,
    instructorAddEventToServer,
    getReportOnSelectedDate,
    getNotificationText,
    deleteEventFromServer,
    setLeftDate,
    setRightDate,
    instructorSki,
    instructorSnowboard
})(Instructors);

import React from 'react';
import {Text, View, ScrollView, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {TopSlider} from "../components/common/TopSlider";
import {Header} from "../components/common/Header";
import {List, ListItem, Button, SearchBar, CheckBox} from 'react-native-elements';
import {connect} from 'react-redux';
import {Spinner} from "../components/common/Spinner";
import DropdownMenu from "react-native-dropdown-menu";
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
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
    instructorAddEventStartTime,
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
import { Appearance } from 'react-native-appearance';
import {TextInput} from "react-native";

class Instructor extends React.Component {
    constructor(props) {
        super(props);
        let now = new Date();
        now.setMinutes(0);
        this.state = {
            showTime: false,
            notes: "",
            duration: 1,
            startTime: now,
        };
    }
    componentDidMount() {
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
        this.props.instructorAddEventStart(currentDay);
        this.onTimeChange(null,this.state.startTime);
        // console.log("This is current date for instructor", currentDay);
        const {user} = this.props;
        this.props.getTrainers(user);
        this.props.getEventOnSelectedDate(user, currentDay);
        this.props.getTrainerAtWorkFromServer(user);
        // console.log("This is user", user, );
        this.props.instructorAddEventEnd(1);
        this.setState({duration:1});
        this.props.instructorAddReportStart(currentDay);
        this.props.instructorAddReportEnd(currentDay);
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

    getSpecializationText(instructor) {
        const {board, ski} = instructor;
        if (board && ski)
            return "Лыжи и Сноуборд";
        if (ski)
            return "Лыжи";
        if (board)
            return "Сноуборд";
    }


    onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.startTime;
        this.setState({"showTime": Platform.OS === 'ios'})
        let hours = `${currentDate.getUTCHours()+6}`;
        let minutes = `${currentDate.getMinutes()}`;
        if (hours.length < 2) {
            hours = "0" + hours;
        }
        if (minutes.length < 2) {
            minutes = "0" + minutes;
        }
        const textTime =`${hours}:${minutes}:00`;
        this.setState({startTime: currentDate})
        this.setState({textTime: textTime})
        this.props.instructorAddEventStartTime(textTime);
        console.log(textTime);
        this.setState({"showTime": Platform.OS === 'ios'})
    };

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
        this.props.instructorAddEventStart(leftDate);
        this.props.instructorAddReportStart(leftDate);
        this.props.instructorAddReportEnd(leftDate);
        this.setState({showNewForm: false})
        this.setState({showReport: false})
    }

    rightPressed() {
        const {user, instructorCurrentDate, rightDate} = this.props;
        this.props.changeDate(instructorCurrentDate, "+");
        this.props.getEventOnSelectedDate(user, rightDate);
        this.props.setLeftDate(rightDate);
        this.props.setRightDate(rightDate);
        this.props.getTrainerAtWorkFromServer(user);
        this.props.instructorAddEventStart(rightDate);
        this.props.instructorAddReportStart(rightDate);
        this.props.instructorAddReportEnd(rightDate);
        this.setState({showNewForm: false})
        this.setState({showReport: false})
    }

    onDateChanged(currentDay) {
        this.props.setCurrentDate(currentDay);
        const {user} = this.props;
        this.props.getEventOnSelectedDate(user, currentDay);
        this.props.getTrainerAtWorkFromServer(user);
        this.props.instructorAddEventStart(currentDay);
        this.props.instructorAddReportStart(currentDay);
        this.props.instructorAddReportEnd(currentDay);
        console.log("This is the date", currentDay);
    }

    updateEvents() {
        const {user, instructorCurrentDate} = this.props;
        //console.log("This is the date", instructorCurrentDate);
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
        //console.log("this is loaded trainr and evnets ", instructorLoadedTrainers, instructorCurrentDate);
        if (this.props.reload) {
            //console.log("I'm reloading");
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
            const {name, phone, rating, photo} = trainer;
            // console.log("This is data of trainer ", trainer);
            return (
                <ScrollView style={{marginTop: 15}}>
                    <Header headerText={`${name}`}
                            onLogoutPressed={this.logoutPressed.bind(this)}
                            style={{width: '70%'}}
                    />
                    <View style={{display: "flex", flexDirection: "row"}}>

                        <View style={{ alignItems: 'center', margin: 10, width: 100}}>
                            <View style={{width: "100%", height: 100, borderRadius: 50, overflow: 'hidden'}}>
                                <Image style={{width: "100%", height: "100%"}} source={{uri: `https://instructor-shym.kz${photo}`}}
                                /></View>
                        </View>

                        {/*{this.renderQueue(trainer.queue)}*/}
                        <View style={{flex: 1}}>
                            <ListItem
                                title={`${phone}`}
                                onPress={() => this.makeCall(phone)}
                                hideChevron
                                rightTitleStyle={{color: '#000', fontSize: 16}}
                            />
                            <ListItem
                                title={`Рейтинг: ${rating}`}
                                hideChevron
                                rightTitleStyle={{color: '#000', fontSize: 16}}
                            />
                            <ListItem
                                title={this.getSpecializationText(trainer)}
                                hideChevron
                                rightTitleStyle={{color: '#000', fontSize: 16}}
                            />
                        </View>
                    </View>

                    <TopSlider
                        currendDateHuman={this.formatDate(this.props.instructorCurrentDate)}
                        currentDate={this.props.instructorCurrentDate}
                        onLeftPressed={this.leftPressed.bind(this)}
                        onRightPressed={this.rightPressed.bind(this)}
                        onDateSelected={this.onDateChanged.bind(this)}
                        atWork={this.props.trainerAtWork}
                        atWorkPressed={this.onTrainerAtWorkChecked.bind(this)}
                    />

                    {this.renderEvents(trainer)}

                    {this.state.showNewForm && this.renderAdditionalForm(trainer)}
                    {!this.state.showNewForm &&
                        <Button
                            buttonStyle={{marginTop: 20}}
                            raised
                            backgroundColor='#1668B5'
                            title='Новое занятие'
                            onPress={() => this.setState({showNewForm: true})}/>
                    }
                    {this.renderReports(trainer)}
                    {this.state.showReport && this.renderReportForm()}
                    {!this.state.showReport &&
                        <Button
                            buttonStyle={{marginTop: 20}}
                            raised
                            backgroundColor='#1668B5'
                            title='Новый отчет'
                            onPress={() => this.setState({showReport: true})}/>
                    }
                    <View style={{marginBottom: 200}}></View>


                </ScrollView>
            )
        } else {
            return (
                <Text>-</Text>
            )
        }
    }

    renderReports(instructor) {
        console.log("Loading:",this.props.instructorReportsLoading);
        // const {reports} = this.props;
        if (this.props.instructorReportsLoading)
            return (<Text style={styles.noDataText}>Загружается...</Text>);
        return (<View>
            {this.props.reports.length > 0 &&
                <TableView>
                    <Section>
                        {this.props.reports.map((report) => (
                            <View>
                                <View style={{display: "flex", flexDirection: "row",
                                    padding: 10,
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    backgroundColor: "white"}}>
                                    <Text style={{textAlign: "left"}}>Забронировано занятий</Text>
                                    <Text style={{flex: 1, textAlign: "right"}}>{report[1]}</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "row",
                                    padding: 10,
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    backgroundColor: "white"}}>
                                    <Text style={{ textAlign: "left"}}>Из них подтверждено</Text>
                                    <Text style={{flex: 1, textAlign: "right"}}>{report[2]}</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "row",
                                    padding: 10,
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    backgroundColor: "white"}}>
                                    <Text style={{ textAlign: "left"}}>Всего часов</Text>
                                    <Text style={{flex: 1, textAlign: "right"}}>{report[3]}</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "row",
                                    padding: 10,
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    backgroundColor: "white"}}>
                                    <Text style={{textAlign: "left"}}>Начислено</Text>
                                    <Text style={{flex: 1, textAlign: "right"}}>{report[4].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} тг</Text>
                                </View>
                            </View>
                        ))}
                    </Section>
                </TableView>}
            {this.props.reports.length === 0 && <Text style={styles.noDataText}></Text>}
        </View>)
    }

    instructorReport(report, instructor) {
        console.log("This is rep element", report);
        console.log("This is rep element", instructor);
        const {id, name, rating} = instructor;
        if ((id === report[0]) || (report[0] === 0 && report[1] === 0 && report[2] === 0)) {
            return (
                <CellVariant key={id}
                                 name={report[1]}
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

    formatDate(dateIn) {
        let date = new Date(dateIn);
        let year = date.getFullYear();
        let month = ["янв","фев","марта","апр","мая","июня","июля","авг","сен","окт","ноя","дек"][date.getMonth()];
        let dt = date.getDate();
        if (dt < 10) {
          dt = '0' + dt;
        }
        return `${dt} ${month} ${year}`
    }

    renderReportForm() {

        let colorScheme = Appearance.getColorScheme();
        let bgcolor = '#FFF';
        if (colorScheme === 'dark') {
            bgcolor = '#000';
        };

        const {buttonStyle} = styles;
        if (2+2==4 || this.props.instructorShowReportForm) {
            return (
                <View style={{flex: 1, margin: 10,
                                 padding: 10, alignItems: 'center'}}>
                    <Text align='center' style={{width: '100%', textAlign: 'center', alignItems: 'center'}}>
                        Новый отчет:
                    </Text>
                    <DatePicker
                        style={{width: 200, margin: 15}}
                        date={this.props.instructorReportStart}
                        isDarkModeEnabled={false}
                        mode="date"
                        placeholder="от"
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
                        style={{width: 200, margin: 15}}
                        date={this.props.instructorReportEnd}
                        mode="date"
                        placeholder="до"
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
                        title='Показать отчет'
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
        if (2+2==4 || instructorEventSuccess.length > 0) {
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
                        trainings.push([dateTime[0], time[0] + ":" + time[1] + "-" + time1[0] + ":" + time1[1], arr[i].ski, arr[i].tarif_txt,
                            arr[i].id, arr[i].own_client, arr[i].is_booked_online, arr[i]]);
                    } else {
                        trainings.push([dateTime[0], time[0] + ":" + time[1], arr[i].ski, arr[i].tarif_txt, arr[i].id, arr[i].own_client, arr[i].is_booked_online]);
                    }
                }
            }

            console.log(trainings);


            if (trainings.length > 0) {
                return (
                    <TableView>
                        <Section>
                            <Text style={{backgroundColor: "white", fontSize: 17, padding: 15}}>Занятия на {this.formatDate(this.props.instructorCurrentDate)}</Text>
                            {trainings.map((training) => (
                                this.instructorTraining(training)
                            ))}
                        </Section>
                    </TableView>
                );
            }
            else {
                if (this.props.instructorEventsLoading){
                    return (<Text style={styles.noDataText}>Загрузка...</Text>)
                } else {
                    return (<Text style={styles.noDataText}>В этот день нет занятий</Text>)
                }
            }

        }
    }

    renderAdditionalForm(trainer) {
        const {buttonStyle} = styles;
        const {instructorsCurrentDate, user} = this.props;
        let colorScheme = Appearance.getColorScheme();
        let bgcolor = '#FFF';
        if (colorScheme === 'dark') {
            bgcolor = '#000';
        };
        if (2+2==4 || this.props.instructorShowAddEventForm) {
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
                        {Platform.OS !== 'ios' && <Button onPress={()=>{this.setState({"showTime": true})}} title={"Время начала: " + this.state.textTime} />}
                        {Platform.OS === 'ios' && <Text style={{textAlign: 'center', alignItems: 'center'}}>
                            Время начала:
                        </Text>}

                        {(this.state.showTime || Platform.OS === 'ios') && <DateTimePicker
                          style={{ height: 50, width: 100}}
                          value={this.state.startTime}
                          mode="time"
                          is24Hour={true}
                          display="default"
                          timeZoneOffsetInMinutes={60*6}
                          onChange={this.onTimeChange.bind(this)}
                          minuteInterval={15}
                        />}
                    </View>
                    <View style={{flex: 1, flexDirection: 'column'}}>

                        <View style={{flexDirection: 'row'}}>
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
                        Продолжительность часов:
                    </Text>
                        <View style={{flexDirection: 'row'}}>

                            <CheckBox
                                        left
                                        title='1'
                                        onPress={()=>this.onInstructorEventDateEnd(1)}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={this.state.duration===1}
                                    />
                            <CheckBox
                                        left
                                        title='1.5'
                                        onPress={()=>this.onInstructorEventDateEnd(1.5)}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={this.state.duration===1.5}
                                    />
                            <CheckBox
                                        left
                                        title='2'
                                        onPress={()=>this.onInstructorEventDateEnd(2)}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={this.state.duration===2}
                                    />
                        </View>
                    <Text style={{textAlign: 'center', alignItems: 'center'}}>
                        Заметки:
                    </Text>
                        <TextInput
                            value={this.state.notes}
                            style={{
                                height: 40,
                                margin: 12,
                                borderWidth: 1,
                                paddingLeft: 12,
                                paddingRight: 12,
                            }}
                            onChangeText={(text)=>{this.setState({"notes":text})}}
                        ></TextInput>

                    </View>

                    <Button
                        buttonStyle={buttonStyle}
                        raised
                        backgroundColor='#1668B5'
                        title='Добавить занятие'
                        onPress={() => this.onSaveEvent(trainer)}/>
                </View>
            )
        } else {
            return (<View/>)
        }
    }

    onSaveEvent = (instructor) => {
        const {user, showAddEvent, text, instructorEventStartTime, instructorEventStartDate, instructorEventEnd, instructorSkillSki, instructorSkillSnowboard} = this.props;
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
            instructorSkillSnowboard,
            notes: this.state.notes,
        });
        this.setState({showNewForm: false})
    };

    onInstructorEventDateStart(date) {
        this.props.instructorAddEventStart(date);
    }

    onInstructorEventDateStartTime(time) {
        console.log(time);
        this.props.instructorAddEventStartTime(`${time}:00`);
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
        this.setState({showReport: false})
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
        let eventObject = training[7];
        if (training[5]) {
            return (
                <Cell key={training[0]+training[1]}
                    cellContentView={
                        <View
                            style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                            <View style={{flexDirection: 'column', flex: 0.3}}>
                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                {training[1]}
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                {training[0]}
                            </Text>
                            </View>
                            <View style={{
                                flex: 0.7, flexDirection: 'column',
                                marginRight: 10, marginLeft: 20,
                                borderColor: "green",
                                borderLeftWidth: 1,
                                paddingLeft: 5,
                            }}>
                                <Text
                                    allowFontScaling
                                    numberOfLines={1}
                                    style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                    {
                                        this.renderEquipment(training[2])
                                    }, {training[3]}
                                </Text>
                                {eventObject.trainer_note !== "" && <Text
                                    allowFontScaling
                                    // numberOfLines={1}
                                    style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                    {eventObject.trainer_note}
                                </Text>}
                                {eventObject.text !== "" && <Text
                                    allowFontScaling
                                    // numberOfLines={1}
                                    style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                    {eventObject.text}
                                </Text>}
                            </View>

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

                            <View style={{flexDirection: 'column', flex: 0.3}}>
                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                {training[1]}
                            </Text>

                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                {training[0]}
                            </Text>
                            </View>
                            <View style={{
                                flex: 0.7, flexDirection: 'column',
                                marginRight: 10, marginLeft: 20,
                                borderColor: "green",
                                borderLeftWidth: 1,
                                paddingLeft: 5,
                            }}>
                            <Text
                                allowFontScaling
                                numberOfLines={1}
                                style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                {
                                    this.renderEquipment(training[2])
                                }, {training[3]}
                            </Text>
                            {eventObject.trainer_note !== "" && <Text
                                    allowFontScaling
                                    // numberOfLines={1}
                                    style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                    {eventObject.trainer_note}
                                </Text>}
                                {eventObject.text !== "" && <Text
                                    allowFontScaling
                                    // numberOfLines={1}
                                    style={{flex: 1, fontSize: 14, textAlign: 'left'}}>
                                    {eventObject.text}
                                </Text>}
                            </View>

                            <TouchableOpacity>
                                <Icon name="close" size={20} color={"lightgray"}/>
                            </TouchableOpacity>

                            {training[6] && <Icon name="wallet" size={20}/> }

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

const CellVariant = (props) => (
    <Cell
        {...props}
        cellContentView={
            <View
                style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}>

                <Text
                    allowFontScaling
                    numberOfLines={2}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.name}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={2}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title2}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={2}
                    style={{flex: 1, fontSize: 14, textAlign: 'center'}}>
                    {props.title3}
                </Text>

                <Text
                    allowFontScaling
                    numberOfLines={2}
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
        instructorReportsLoading,
        instructorEventsLoading,
        instructorReportStart,
        instructorReportEnd,
        reports,
        text,
        instructorEventStartDate,
        instructorEventStartTime,
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
        instructorReportsLoading,
        instructorEventsLoading,
        reload,
        instructorShowReportForm,
        instructorReportStart,
        instructorReportEnd,
        reports,
        text,
        instructorEventStartDate,
        instructorEventStartTime,
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
    instructorAddEventStartTime,
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

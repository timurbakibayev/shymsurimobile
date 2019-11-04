import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {List, ListItem, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {getTakenTrainerOnDate} from '../actions/takenTrainer';
import DatePicker from 'react-native-datepicker';
import {getReportOnSelectedDate, reportStartDate, reportEndDate, getReportTrainers} from '../actions/reports';

// import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';
// import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';
import {
    Cell,
    Section,
    TableView,
} from 'react-native-tableview-simple';


class ReportScreen extends React.Component {

    onLearnMore = (instructor, report) => {
        this.props.navigation.navigate('ReportDetails', {...instructor, report});
    };


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
        const {user} = this.props;
        console.log("This is chosen dates", currentDay + " " + currentDay);
        this.props.getReportOnSelectedDate(user, currentDay, currentDay);
    }

    onDateStartChange(date) {
        this.props.reportStartDate(date);
    }

    onDateEndChange(date) {
        this.props.reportEndDate(date);
    }


    applyDate() {
        const {user, startDate, endDate} = this.props;
        console.log("This is chosen dates", startDate + " " + endDate);
        this.props.getReportOnSelectedDate(user, startDate, endDate);
    }

    repItem(rep) {
        console.log("This is rep element", rep);
        return (
            <CellVariant name={rep[0]}
                         title2={rep[1]}
                         title3={rep[2]}
                         title4={rep[3]}/>
        )
    }


    renderReports() {
        const {report} = this.props;
        const {head, title, row, text} = styles;
        // const tableHead = ["Ф.И.О", "К-во занятий", "Занятия", "Часы", "Начислено"];
        const tableHead = ['Head', 'Head2', 'Head3', 'Head4'];
        const tableData = [
            ['1', '2', '3', '4'],
            ['a', 'b', 'c', 'd'],
        ];
        // const tableHead = ['Head', 'Head2'];
        // const tableData = [
        //     ['1', 'a'],
        //     ['2', 'b'],
        //     ['3', 'c'],
        //     ['4', 'd']
        // ];
        if (report) {
            return (
                <TableView>
                    <Section>
                        <CellVariant name="Ф.И.О" title2="К-во занятий" title3="Занятия" title4="Часы"/>
                        {report.map((rep) => (
                            this.repItem(rep)
                        ))}
                    </Section>
                </TableView>

                // <View style={{marginTop: 15, padding: 0}}>
                //     <Table>
                //         <Row data={tableHead} style={head} flexArr={[3, 1, 1, 1]} textStyle={text}/>
                //         <Rows data={report} flexArr={[3, 1, 1, 1]} style={row} textStyle={text}/>
                //     </Table>
                // </View>
            );
        } else {
            return (<Text>ok</Text>)
        }
    }


    render() {
        const {container} = styles;
        // const tableHead = ['Head', 'Head2', 'Head3', 'Head4'];
        // const tableData = [
        //     ['1', '2', '3', '4'],
        //     ['a', 'b', 'c', 'd'],
        // ];
        const tableHead = ['Head', 'Head2', 'Head3', 'Head4'];
        const tableTitle = ['Title', 'Title2'];
        const tableData = [
            ['', '', ''],
            ['', '', ''],
        ];
        return (
            <View>
                <ScrollView>
                    <View>
                        <DatePicker
                            style={{width: 200, marginTop: 15}}
                            date={this.props.startDate}
                            mode="date"
                            placeholder="Период с"
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
                            date={this.props.endDate}
                            mode="date"
                            placeholder="Период по"
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
                            onDateChange={this.onDateEndChange.bind(this)}
                        />
                    </View>
                    <Button
                        buttonStyle={{marginTop: 15}}
                        raised
                        backgroundColor='#1668B5'
                        title='Применить'
                        onPress={() => this.applyDate()}/>
                    {this.renderReports()}
                </ScrollView>
            </View>
        )
    }
}

// const styles = StyleSheet.create({
//     head: {height: 40, backgroundColor: '#f1f8ff'},
//     text: {marginLeft: 5},
//     row: {height: 30}
//     // head: {height: 40, backgroundColor: '#f1f8ff'},
//     // text: {marginLeft: 5},
//     // row: {height: 30}
//     // container: {
//     //     backgroundColor: '#FFF',
//     //     flex: 1
//     // },
//     // head: {height: 60, backgroundColor: '#f1f8ff'},
//     // text: {textAlign: 'center'},
//     // title: {flex: 1, backgroundColor: '#f6f8fa'},
//     // row: {height: 60},
//     // rowText: {height: 28, textAlign: 'center'}
// });

const CellVariant = (props) => (
    <Cell
        {...props}
        cellContentView={
            <View
                style={{alignItems: 'center', flexDirection: 'row', flex: 1, paddingVertical: 10}}
            >
                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 3, fontSize: 20}}
                >
                    {props.name}
                </Text><Text
                allowFontScaling
                numberOfLines={1}
                style={{flex: 1, fontSize: 20}}
            >
                {props.title2}
            </Text>
                <Text
                    allowFontScaling
                    numberOfLines={1}
                    style={{flex: 1, fontSize: 20}}
                >
                    {props.title3}
                </Text><Text
                allowFontScaling
                numberOfLines={1}
                style={{flex: 1, fontSize: 20}}
            >
                {props.title4}
            </Text>
            </View>
        }
    />
);


const styles = StyleSheet.create({
    head: {height: 40, backgroundColor: '#f1f8ff'},
    text: {marginLeft: 5},
    row: {height: 30}
});


const mapStateToProps = ({reportsReducer, auth}) => {
    const {user} = auth;
    const {startDate, endDate, report, reportError, reportInstructors} = reportsReducer;
    return {
        user,
        reportInstructors,
        startDate,
        endDate,
        report,
        reportError
    };
};

export default connect(mapStateToProps, {
    getReportOnSelectedDate,
    reportStartDate,
    reportEndDate,
    getReportTrainers
})(ReportScreen);
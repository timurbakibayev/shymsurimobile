import React from 'react';
import {ScrollView, Text, StyleSheet, Alert} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';


export default class ReportDetailScreen extends React.Component {


    renderReports() {
        const {id, report} = this.props.navigation.state.params;
        const {head, title, row, text} = styles;
        const tableHead = ["Количество часов", "Количество занятий", "Начислено"];
        const reports = [];
        let count = 0;

        if (report) {
            let arr = report;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].resource === id) {
                    console.log("This is matches", i);
                    reports.push([arr[i].count_hours, arr[i].count, arr[i].amount_instructor]);
                }
            }
        }
        if (report) {
            return (
                <Table>
                    <Row data={tableHead} style={head} flexArr={[5, 5, 5]} textStyle={text}/>
                    <TableWrapper style={{flexDirection: 'row'}}>
                        <Rows data={reports} flexArr={[5, 5, 5]} style={row} textStyle={styles.text}/>
                    </TableWrapper>
                </Table>
            );
        } else {
            return (<Text>No data, sorry</Text>)
        }
    }


    render() {
        return (
            <ScrollView>
                {this.renderReports()}
            </ScrollView>
        );
    }

}


const
    styles = StyleSheet.create({
        container: {
            backgroundColor: '#FFF'
        },
        head: {height: 40, backgroundColor: '#f1f8ff'},
        title: {flex: 1, backgroundColor: '#f6f8fa'},
        row: {height: 28},
        text: {textAlign: 'center'}
    });
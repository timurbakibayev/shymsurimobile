import {REPORT_END_DATE, REPORT_START_DATE, REPORT_SUCCESS, REPORT_TRAINERS_SUCCESS, URL} from "./types";
// import {URL} from "../const";

export const getReportOnSelectedDate = (user, startDate, endDate) => {
    return (dispatch) => {
        fetch(`${URL}events/grouped/?date=${startDate}&date_to=${endDate}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
            .then((reportOutput) => reportReturnSuccess(dispatch, reportOutput))
            .catch((error) => console.log(error));
    }
};

export const getReportTrainers = (user) => {
    console.log("This is user token", user.token);
    return (dispatch) => {
        fetch(`${URL}trainers/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
            .then((reportInstructors) => getReportTrainersSuccess(dispatch, reportInstructors))
            .catch((error) => console.log(error));
    }
};


const getReportTrainersSuccess = (dispatch, reportInstructors) => {
    dispatch({
        type: REPORT_TRAINERS_SUCCESS,
        payload: reportInstructors
    })
};

export const reportStartDate = (date) => {
    return {
        type: REPORT_START_DATE,
        payload: date
    }
};

export const reportEndDate = (date) => {
    return {
        type: REPORT_END_DATE,
        payload: date
    }
};


const reportReturnSuccess = (dispatch, reportOutput) => {
    let result = [];
    let resultIndexes = [];
    for (let i in reportOutput) {
        result.push([reportOutput[i].resource_txt,
            reportOutput[i].count,
            reportOutput[i].count_approved,
            reportOutput[i].count_hours,
            reportOutput[i].amount_instructor]);
        resultIndexes.push(i + 1);
    }
    console.log("This is all reports", result);
    dispatch({
        type: REPORT_SUCCESS,
        payload: result
    });

};


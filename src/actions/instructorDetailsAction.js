import {
    INSTRUCTOR_CURRENT_DATE,
    INSTRUCTOR_DETAIL_ADD_EVENT, INSTRUCTOR_DETAIL_EVENT_END, INSTRUCTOR_DETAIL_EVENT_START,
    INSTRUCTOR_DETAIL_HIDE_EVENT, INSTRUCTOR_EVENTS_ON_DATE, INSTRUCTOR_RELOAD, INSTRUCTOR_REPORT_END,
    INSTRUCTOR_REPORT_START,
    INSTRUCTOR_REPORT_SUCCESS,
    INSTRUCTOR_SHOW_REPORT,
    URL,
} from "./types";
// import {URL} from "../const";

export const instructorAddEventStart = (date) => {
    return {
        type: INSTRUCTOR_DETAIL_EVENT_START,
        payload: date
    }
};

export const instructorAddEventEnd = (date) => {
    return {
        type: INSTRUCTOR_DETAIL_EVENT_END,
        payload: date
    }
};


export const instructorAddReportStart = (date) => {
    return {
        type: INSTRUCTOR_REPORT_START,
        payload: date
    }
};

export const instructorAddReportEnd = (date) => {
    return {
        type: INSTRUCTOR_REPORT_END,
        payload: date
    }
};


export const instructorAddEvent = () => {
    return {
        type: INSTRUCTOR_DETAIL_ADD_EVENT
    }
};

export const instructorShowReport = () => {
    return {
        type: INSTRUCTOR_SHOW_REPORT
    }
};


export const getReportOnSelectedDate = (user, instructorReportStart, instructorReportEnd) => {
    return (dispatch) => {
        fetch(`${URL}events/grouped/?date=${instructorReportStart}&date_to=${instructorReportEnd}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
        // .then((responseJson) => console.log("This is response json ", responseJson))
            .then((responseJson) => onInstructorReportSuccess(dispatch, responseJson))
            .catch((error) => console.log(error));
    }
};


export const changeDate = (instructorsCurrentDate, sign) => {
    return (dispatch) => {
        let dateTime = instructorsCurrentDate.split("-");
        let anotherDate = new Date(dateTime[0] + '/' + dateTime[1] + '/' + dateTime[2]);
        if (sign === "+") {
            anotherDate.setDate(anotherDate.getDate() + 1);
            let month = (anotherDate.getMonth() + 1);
            let day = anotherDate.getDate();
            let year = anotherDate.getFullYear();
            if (day < 10) {
                console.log("This is smaller that 10");
                day = "0" + day;
                console.log("This is new date", day);
            }
            let returningDate = year + "-" + month + "-" + day;
            dispatch({
                type: INSTRUCTOR_CURRENT_DATE,
                payload: returningDate
            });
        } else {
            anotherDate.setDate(anotherDate.getDate() - 1);
            let month = (anotherDate.getMonth() + 1);
            let day = anotherDate.getDate();
            let year = anotherDate.getFullYear();
            if (day < 10) {
                console.log("This is smaller that 10");
                day = "0" + day;
                console.log("This is new date", day);
            }
            let returningDate = year + "-" + month + "-" + day;
            dispatch({
                type: INSTRUCTOR_CURRENT_DATE,
                payload: returningDate
            });
        }
    }
};

export const getEventsOnSelectedDate = (user, date) => {
    return (dispatch) => {
        fetch(`${URL}events/?date=${date}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
            .then((events) => instructorEventsOnDateSuccess(dispatch, events))
            .catch((error) => console.log(error));
    }
};
// export const deleteEventFromServer = (user, id) => {
//     console.log("deleting event", user.token, id);
//     return (dispatch) => {
//         fetch(`http://shymbulak.papers.kz/events/${id}/`, {
//             method: 'DELETE',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `JWT ${ user.token }`
//             }
//         }).then((response) => response.json())
//             .then((responseJson) => console.log("This is deleting ", responseJson))
//             .catch((error) => console.log(error));
//     }
// };

export const deleteEventFromServer = (user, id) => {
    console.log("deleting event", user.token, id);
    console.log("This is delete url", `http://shymbulak.papers.kz/events/${id}/`);
    return (dispatch) => {
        fetch(`${URL}events/${id}/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then(() => reloadForms(dispatch))
            // .then(() => hideAdditionalForm(dispatch))
            .catch((error) => console.log(error));
    }
};


const reloadForms = (dispatch) => {
    dispatch({
        type: INSTRUCTOR_RELOAD,
    })
};


const instructorEventsOnDateSuccess = (dispatch, events) => {
    dispatch({
        type: INSTRUCTOR_EVENTS_ON_DATE,
        payload: events
    })
};


const onInstructorReportSuccess = (dispatch, responseJson) => {
    let result = [];
    let resultIndexes = [];
    for (let i in responseJson) {
        result.push([
            responseJson[i].resource,
            responseJson[i].count,
            responseJson[i].count_approved,
            responseJson[i].count_hours,
            responseJson[i].amount_instructor]);
        resultIndexes.push(i + 1);
    }
    console.log("This is all reports", result);
    dispatch({
        type: INSTRUCTOR_REPORT_SUCCESS,
        payload: result
    });
};


export const instructorAddEventToServer = ({user, id, name, rating, instructorEventStart, instructorEventEnd}) => {
    // console.log("This is token", user.token + " " + id);
    return (dispatch) => {
        console.log("This is event ", user.token, id, name, rating, instructorEventStart, instructorEventEnd);
        fetch(`${URL}events/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            },
            body:
                JSON.stringify({
                    start: instructorEventStart,
                    end: instructorEventEnd,
                    text: '',
                    approved: false,
                    resource: id,
                    resource_txt: name,
                    resource_rating: rating,
                    ski: false,
                    board: false,
                    tarif: 1,
                    tarif_txt: "Нет тарифа",
                    cssClass: "my-event",
                    resizeDisabled: false,
                    backColor: "#F7F7F9",
                    own_client: true,
                    group_size: 1,
                    bubbleHtml: "1h CH (8500 тенге)<br>Свой клиент",
                    amount: 0,
                    amount_instructor: 0,
                    amount_school: 0,
                    rate: 0,
                    duration: 1
                })
        }).then((response) => response.json())
            .then((success) => hideAdditionalForm(dispatch))
            .catch((error) => console.log(error));
    }
};


const hideAdditionalForm = (dispatch) => {
    dispatch({
        type: INSTRUCTOR_DETAIL_HIDE_EVENT,
    })
};

export const setInstructorCurrentDate = (date) => {
    return (dispatch) => {
        dispatch({
            type: INSTRUCTOR_CURRENT_DATE,
            payload: date
        })
    }
};

import {
    INSTRUCTOR_AT_WORK_FROM_SERVER,
    INSTRUCTOR_DATA_LOADING, INSTRUCTOR_DETAIL_ADD_EVENT, INSTRUCTOR_DETAIL_EVENT_END, INSTRUCTOR_DETAIL_EVENT_START,
    INSTRUCTOR_DETAIL_HIDE_EVENT,
    INSTRUCTOR_EVENT_FAIL,
    INSTRUCTOR_EVENT_LOADING,
    INSTRUCTOR_REPORT_LOADING,
    INSTRUCTOR_EVENT_SUCCESS, INSTRUCTOR_LEFT_DATE, INSTRUCTOR_RELOAD, INSTRUCTOR_REPORT_END, INSTRUCTOR_REPORT_START,
    INSTRUCTOR_REPORT_SUCCESS, INSTRUCTOR_RIGHT_DATE, INSTRUCTOR_SHOW_REPORT, INSTRUCTOR_SKI, INSTRUCTOR_SNOWBOARD,
    INSTRUCTOR_TRAINERS_LOADED,
    INSTRUCTOR_TRAINERS_LOADED_ERROR,
    INSTRUCTORS_CURRENT_DATE, TRAINER_AT_WORK, TRAINER_SKI, TRAINER_SNOWBOARD,
    URL,
} from "./types";
// import {URL} from "../const";

export const setCurrentDate = (date) => {
    return (dispatch) => {
        dispatch({type: INSTRUCTOR_DATA_LOADING});
        dispatch({
            type: INSTRUCTORS_CURRENT_DATE,
            payload: date
        })
    }
};

export const changeDate = (instructorsCurrentDate, sign) => {
    return (dispatch) => {
        dispatch({type: INSTRUCTOR_DATA_LOADING});
        let dateTime = instructorsCurrentDate.split("-");
        let anotherDate = new Date(dateTime[0] + '/' + dateTime[1] + '/' + dateTime[2]);
        if (sign === "+") {
            anotherDate.setDate(anotherDate.getDate() + 1);
            let month = (anotherDate.getMonth() + 1);
            let day = anotherDate.getDate();
            let year = anotherDate.getFullYear();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            let returningDate = year + "-" + month + "-" + day;
            // console.log("This is change date of right", returningDate);
            dispatch({
                type: INSTRUCTORS_CURRENT_DATE,
                payload: returningDate
            });
        } else {
            anotherDate.setDate(anotherDate.getDate() - 1);
            let month = (anotherDate.getMonth() + 1);
            let day = anotherDate.getDate();
            let year = anotherDate.getFullYear();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            let returningDate = year + "-" + month + "-" + day;
            // console.log("This is change date of left", returningDate);
            dispatch({
                type: INSTRUCTORS_CURRENT_DATE,
                payload: returningDate
            });
        }
    }
};

export const setLeftDate = (currentDate) => {
    return (dispatch) => {
        dispatch({type: INSTRUCTOR_DATA_LOADING});
        let dateTime = currentDate.split("-");
        let anotherDate = new Date(dateTime[0] + '/' + dateTime[1] + '/' + dateTime[2]);
        anotherDate.setDate(anotherDate.getDate() - 1);
        let month = (anotherDate.getMonth() + 1);
        let day = anotherDate.getDate();
        let year = anotherDate.getFullYear();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        let returningDate = year + "-" + month + "-" + day;
        // console.log("This is current date of left", currentDate, returningDate);
        dispatch({
            type: INSTRUCTOR_LEFT_DATE,
            payload: returningDate
        })
    }
};

export const setRightDate = (currentDate) => {
    return (dispatch) => {
        dispatch({type: INSTRUCTOR_DATA_LOADING});
        let dateTime = currentDate.split("-");
        let anotherDate = new Date(dateTime[0] + '/' + dateTime[1] + '/' + dateTime[2]);
        anotherDate.setDate(anotherDate.getDate() + 1);
        let month = (anotherDate.getMonth() + 1);
        let day = anotherDate.getDate();
        let year = anotherDate.getFullYear();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        let returningDate = year + "-" + month + "-" + day;
        // console.log("This is current date of right", currentDate, returningDate);
        dispatch({
            type: INSTRUCTOR_RIGHT_DATE,
            payload: returningDate
        })
    }
};


export const getTrainers = (user) => {
    console.log("This is user toke ", user.token);
    return (dispatch) => {
        dispatch({type: INSTRUCTOR_DATA_LOADING});
        fetch(`${URL}trainers/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
            .then((instructors) => getTrainerSuccess(dispatch, instructors))
            .catch(() => getTrainerFailed(dispatch));
    }
};

const getTrainerFailed = (dispatch) => {
    dispatch({type: INSTRUCTOR_TRAINERS_LOADED_ERROR});
};

export const getEventOnSelectedDate = (user, currentDay) => {
    return (dispatch) => {
        dispatch({type: INSTRUCTOR_EVENT_LOADING});
        fetch(`${URL}events/?date=${currentDay}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
        // .then((events) => console.log("This is events", events))
            .then((events) => getEventsSuccess(dispatch, events))
            .catch(() => getEventsFail(dispatch));
    }

};


export const deleteEventFromServer = (user, id) => {
    console.log("deleting event", user.token, id);
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

const getEventsSuccess = (dispatch, events) => {
    dispatch({
        type: INSTRUCTOR_EVENT_SUCCESS,
        payload: events
    })
};

const getEventsFail = (dispatch) => {
    dispatch({
        type: INSTRUCTOR_EVENT_FAIL
    })
};

export const instructorShowReport = () => {
    return {
        type: INSTRUCTOR_SHOW_REPORT
    }
};

export const instructorAddEvent = () => {
    return {
        type: INSTRUCTOR_DETAIL_ADD_EVENT
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

const getTrainerSuccess = (dispatch, instructors) => {
    dispatch({
        type: INSTRUCTOR_TRAINERS_LOADED,
        payload: instructors,
    })
};

export const getReportOnSelectedDate = (user, instructorReportStart, instructorReportEnd) => {
    return (dispatch) => {
        dispatch({
            type: INSTRUCTOR_REPORT_LOADING,
            payload: true,
        });
        console.log("fetching report...");
        fetch(`${URL}events/grouped/?date=${instructorReportStart}&date_to=${instructorReportEnd}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
            .then((responseJson) => onInstructorReportSuccess(dispatch, responseJson))
            .catch((error) => console.log(error));
    }
};

const onInstructorReportSuccess = (dispatch, responseJson) => {
    let result = [];
    let resultIndexes = [];
    console.log("onInstrRepSuc");
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
    if (result.length === 0)
        result.push([0,0,0,0,0])
    dispatch({
        type: INSTRUCTOR_REPORT_SUCCESS,
        payload: result
    });
};

export const instructorAddEventStart = (date) => {
    return {
        type: INSTRUCTOR_DETAIL_EVENT_START,
        datetime: "date",
        payload: date
    }
};
export const instructorAddEventStartTime = (time) => {
    return {
        type: INSTRUCTOR_DETAIL_EVENT_START,
        datetime: "time",
        payload: time
    }
};
export const instructorAddEventEnd = (time) => {
    return {
        type: INSTRUCTOR_DETAIL_EVENT_END,
        payload: time
    }
};


export const instructorAddEventToServer = ({user, id, name, rating, instructorEventStartDate, instructorEventStartTime, instructorEventEnd, instructorSkillSki, instructorSkillSnowboard}) => {
    // console.log("This is token", user.token + " " + id);
    return (dispatch) => {
        console.log("This is event ", user.token, id, name, rating, instructorEventStartDate,instructorEventStartTime, instructorEventEnd, instructorSkillSki, instructorSkillSnowboard);
        fetch(`${URL}events/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            },
            body:
                JSON.stringify({
                    start: `${instructorEventStartDate} ${instructorEventStartTime}`,
                    duration: instructorEventEnd,
                    text: '',
                    approved: false,
                    resource: id,
                    resource_txt: name,
                    resource_rating: rating,
                    ski: instructorSkillSki,
                    board: instructorSkillSnowboard,
                    tarif: 1,
                    backColor: "#F7F7F9",
                    own_client: true,
                })
        }).then((response) =>
            response.json()
        )
            .then((success) => hideAdditionalForm(dispatch, success))
            .catch((error) => console.log(error));
    }
};

const hideAdditionalForm = (dispatch, success) => {
    console.log("This is message", success);
    dispatch({
        type: INSTRUCTOR_DETAIL_HIDE_EVENT,
        payload: true
    })
};

export const setTrainerAtWork = (trainerAtWork) => {
    if (trainerAtWork) {
        return {
            type: TRAINER_AT_WORK,
            payload: false
        }
    } else {
        return {
            type: TRAINER_AT_WORK,
            payload: true
        }
    }
};

export const checkTrainerAtWork = (trainerAtWork) => {
    // console.log("This is check at work", trainerAtWork);
    return {
        type: TRAINER_AT_WORK,
        payload: trainerAtWork
    }
};

export const setTrainerAtWorkOnServer = (trainerAtWork, trainerId, date, user) => {
    return (dispatch) => {
        console.log("This is data to server", trainerAtWork, trainerId, date, user.token);
        fetch(`${URL}trainers/${trainerId}/atwork/${date}/`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${ user.token }`
                },
                body:
                    JSON.stringify({
                        at_work: trainerAtWork
                    })
            }).then((response) => response.json())
            .then((message) => checkAtWork(message.at_work))
            .catch((error) => {
                console.log("This is error", error)
            });


    }
};

const checkAtWork = (trainerAtWork) => {
    // console.log("This is check at work", trainerAtWork);
    return {
        type: TRAINER_AT_WORK,
        payload: trainerAtWork
    }
};

export const getTrainerAtWorkFromServer = (user) => {
    return (dispatch) => {
        fetch(`${URL}trainers/${user.trainers[0]}/atwork`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${ user.token }`
                }
            }).then((response) => response.json())
            .then((instructorAtWork) => instructorAtWorkFromServerSuccess(dispatch, instructorAtWork))
            .catch((error) => {
                console.log("This is error", error)
            });
    }
};

const instructorAtWorkFromServerSuccess = (dispatch, instructorAtWork) => {
    dispatch({
        type: INSTRUCTOR_AT_WORK_FROM_SERVER,
        payload: instructorAtWork
    })
};

export const instructorSki = (instructorSkillSki) => {
    if (instructorSkillSki) {
        return {
            type: INSTRUCTOR_SKI,
            payload: false
        }
    } else {
        return {
            type: INSTRUCTOR_SKI,
            payload: true
        }
    }
};

export const instructorSnowboard = (instructorSkillSnowboard) => {
    if (instructorSkillSnowboard) {
        return {
            type: INSTRUCTOR_SNOWBOARD,
            payload: false
        }
    } else {
        return {
            type: INSTRUCTOR_SNOWBOARD,
            payload: true
        }
    }
};
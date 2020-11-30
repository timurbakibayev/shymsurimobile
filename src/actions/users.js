import {
    ADD_INSTRUCTOR,
    EVENT_LOADED, EVENT_LOADED_FAIL, INSTRUCTOR_AT_WORK_FROM_SERVER, INSTRUCTOR_DETAIL, INSTRUCTOR_DETAIL_ADD_EVENT,
    INSTRUCTOR_DETAIL_EVENT_END,
    INSTRUCTOR_DETAIL_EVENT_START, INSTRUCTOR_DETAIL_HIDE_EVENT, INSTRUCTOR_LEFT_DATE, INSTRUCTOR_RELOAD,
    INSTRUCTOR_REPORT_END,
    INSTRUCTOR_REPORT_START, INSTRUCTOR_REPORT_SUCCESS, INSTRUCTOR_RIGHT_DATE,
    INSTRUCTOR_SHOW_REPORT, INSTRUCTOR_SKI, INSTRUCTOR_SNOWBOARD, INSTRUCTORS_CHANGE_SCREEN,
    INSTRUCTORS_CURRENT_DATE, INSTRUCTORS_RETURN_TO_INSTRUCTORS,
    INSTRUCTORS_SEARCHING_FOR, TRAINER_AT_WORK,
    TRAINERS_AT_WORK, TRAINERS_AT_WORKD,
    USERS_LOADED,
    USERS_LOADED_ERROR,
    USERS_LOADING, URL
} from "./types";
// import {URL} from "../const";

export const getUsers = ({randomToken}) => {
    return (dispatch) => {
        dispatch({type: USERS_LOADING});
        fetch(`${URL}users/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ randomToken }`
            }
        }).then((response) => response.json())
            .then((message) => {
                console.log("This is message", message)
            })
            .catch((error) => {
                console.log("This is error", error)
            });


    }
};

export const getTrainers = ({token}) => {
    return (dispatch) => {
        dispatch({type: USERS_LOADING});
        fetch(`${URL}trainers/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ token }`
            }
        }).then((response) => response.json())
            .then((instructors) => getTrainerSuccess(dispatch, instructors))
            .catch(() => getTrainerFailed(dispatch));
    }
};

export const getTrainersAtWork = (user, currentDay) => {
    // console.log("This is current date to get trainer ", currentDay);
    return (dispatch) => {
        fetch(`${URL}trainers/?date=${currentDay.substring(0, 10)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
        // .then((trainersAtWork) => console.log("This is trainer that are available ", trainersAtWork))
            .then((trainersAtWork) => getTrainersAtWorkSuccess(dispatch, trainersAtWork))
            .catch((error) => {
                console.log("this is an error", error)
            });


    }
};

export const searchingFor = (text) => {
    return {
        type: INSTRUCTORS_SEARCHING_FOR,
        payload: text
    }
};


const getTrainersAtWorkSuccess = (dispatch, workingTrainers) => {
    dispatch({
        type: TRAINERS_AT_WORK,
        payload: workingTrainers
    })
};

export const getEvents = ({token}) => {
    return (dispatch) => {
        dispatch({type: USERS_LOADING});
        fetch(`${URL}events/?date=all`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ token }`
            }
        }).then((response) => response.json())
            .then((events) => getEventsSuccess(dispatch, events))
            .catch(() => getEventFail(dispatch));
    }

};

// export const getCurrentEvents = ({token}) => {
//     let today = new Date();
//     let dd = today.getDate();
//     let mm = today.getMonth() + 1; //January is 0!
//
//     let yyyy = today.getFullYear();
//     if (dd < 10) {
//         dd = '0' + dd;
//     }
//     if (mm < 10) {
//         mm = '0' + mm;
//     }
//     let currentDate = yyyy + '-' + mm + '-' + dd;
//     console.log(`http://shymbulak.papers.kz/events/?date=${currentDate}`);
//     return (dispatch) => {
//         fetch(`http://shymbulak.papers.kz/events/?date=${currentDate}`, {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `JWT ${ token }`
//             }
//         }).then((response) => response.json())
//             .then(responseJson => console.log(responseJson))
//             .catch((error) => console.log(error));
//     }
// };


export const getEventOnDate = (user, currentDay) => {
    return (dispatch) => {
        console.log("This is current event date ", currentDay);
        console.log("Request:", `${URL}events/?date=${currentDay}`);
        dispatch({type: USERS_LOADING});
        fetch(`${URL}events/?date=${currentDay}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
            .then((events) => {
                getEventsSuccess(dispatch, events);
            })
            .catch((error) => console.log(error));
    }

};

// const getEventsSuccess = (dispatch, events) => {
//     dispatch({
//         type: EVENT_LOADED,
//         payload: events
//     })
// };


export const changeDate = (instructorsCurrentDate, sign) => {
    return (dispatch) => {
        let dateTime = instructorsCurrentDate.split("-");
        let anotherDate = new Date(parseInt(dateTime[0]), parseInt(dateTime[1])-1, parseInt(dateTime[2]),1,1,1);
        console.log("actions/users/changeDate")
        console.log(dateTime);
        console.log(anotherDate);

        if (sign === "+") {
            anotherDate.setDate(anotherDate.getDate() + 1);
         } else {
            anotherDate.setDate(anotherDate.getDate() - 1);
        }

        console.log(anotherDate);
        let month = (anotherDate.getMonth() + 1);
        let day = anotherDate.getDate();
        let year = anotherDate.getFullYear();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            // console.log("This is smaller that 10");
            day = "0" + day;
            // console.log("This is new date", day);
        }
        let returningDate = year + "-" + month + "-" + day;
        dispatch({
            type: INSTRUCTORS_CURRENT_DATE,
            payload: returningDate
        });

    }
};

export const addInstructor = () => {
    return (dispatch) => {
        dispatch({
            type: ADD_INSTRUCTOR
        })
    }
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

export const instructorAddEventEnd = (date) => {
    return {
        type: INSTRUCTOR_DETAIL_EVENT_END,
        payload: date
    }
};


export const instructorAddEventToServer = ({user, id, name, rating, instructorEventStartDate, instructorEventStartTime, instructorEventEnd, instructorSkillSki, instructorSkillSnowboard}) => {
    // console.log("This is token", user.token + " " + id);
    return (dispatch) => {
        console.log("This is event ",
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
                    // tarif_txt: "Нет тарифа",
                    // cssClass: "my-event",
                    // resizeDisabled: false,
                    backColor: "#F7F7F9",
                    own_client: true,
                    // group_size: 1,
                    // bubbleHtml: "1h CH (8500 тенге)<br>Свой клиент",
                    // amount: 0,
                    // amount_instructor: 0,
                    // amount_school: 0,
                    // rate: 0
                })
            );
        fetch(`${URL}events/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${user.token}`
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
                    // tarif_txt: "Нет тарифа",
                    // cssClass: "my-event",
                    // resizeDisabled: false,
                    backColor: "#F7F7F9",
                    own_client: true,
                    // group_size: 1,
                    // bubbleHtml: "1h CH (8500 тенге)<br>Свой клиент",
                    // amount: 0,
                    // amount_instructor: 0,
                    // amount_school: 0,
                    // rate: 0
                })

            }).then((response) =>
                response.json()
            )
                .then((success) => hideAdditionalForm(dispatch, success))
                .catch((error) => console.log(error));
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

export const getNotificationText = (notification) => {
    return (dispatch) => {
        dispatch({
            type: ADD_INSTRUCTOR,
            payload: notification
        })
    }
};


export const deleteEventFromServer = (user, id) => {
    // console.log("deleting event", user.token, id);
    // console.log("This is delete url", `http://shymbulak.papers.kz/events/${id}/`);
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
    // console.log("This is all reports", result);
    dispatch({
        type: INSTRUCTOR_REPORT_SUCCESS,
        payload: result
    });
};

const hideAdditionalForm = (dispatch, message) => {
    console.log("This is instructor event addition success ", message);
    dispatch({
        type: INSTRUCTOR_DETAIL_HIDE_EVENT,
        payload: true
    })
};

const reloadForms = (dispatch) => {
    dispatch({
        type: INSTRUCTOR_RELOAD,
    })
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

export const getInstructorDetails = (instructor) => {
    return (dispatch) => {
        dispatch({
            type: INSTRUCTOR_DETAIL,
            payload: instructor
        })
    }
};


const getTrainerFailed = (dispatch) => {
    dispatch({type: USERS_LOADED_ERROR});
};

const getTrainerSuccess = (dispatch, instructors) => {

    dispatch({
        type: USERS_LOADED,
        payload: instructors
    })
};


const getEventFail = (dispatch) => {
    dispatch({type: EVENT_LOADED_FAIL})
};


export const setCurrentDate = (date) => {
    return (dispatch) => {
        dispatch({
            type: INSTRUCTORS_CURRENT_DATE,
            payload: date
        })
    }
};

export const setTrainerAtWorkOnServer = (trainerAtWork, trainerId, date, user) => {
    return (dispatch) => {
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
            .then((message) => {
                console.log("This is message", message)
            })
            .catch((error) => {
                console.log("This is error", error)
            });


    }
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

const getEventsSuccess = (dispatch, events) => {
    dispatch({
        type: EVENT_LOADED,
        payload: events
    })
};

export const instructorChangeScreen = (chosenTrainer) => {
    // console.log("This is chosen trainer", chosenTrainer);
    return {
        type: INSTRUCTORS_CHANGE_SCREEN,
        payload: chosenTrainer
    }
};

export const returnToInstructor = () => {
    return {
        type: INSTRUCTORS_RETURN_TO_INSTRUCTORS
    }
};


export const setLeftDate = (currentDate) => {
    return (dispatch) => {
        // dispatch({type: INSTRUCTOR_DATA_LOADING});
        console.log("currentDate in setLeftDate",currentDate);
        let dateTime = currentDate.split("-");
        console.log("new date:",parseInt(dateTime[0]), parseInt(dateTime[1])-1, parseInt(dateTime[2]),1,1,1);
        let anotherDate = new Date(parseInt(dateTime[0]), parseInt(dateTime[1])-1, parseInt(dateTime[2]),1,1,1);
        console.log("same another date", anotherDate);
        anotherDate.setDate(anotherDate.getDate() - 1);
        console.log("parsed current date", dateTime);
        console.log("another date - 1 = ", anotherDate);

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
        // dispatch({type: INSTRUCTOR_DATA_LOADING});
        let dateTime = currentDate.split("-");
        let anotherDate = new Date(parseInt(dateTime[0]), parseInt(dateTime[1])-1, parseInt(dateTime[2]),1,1,1);
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
        console.log("This is current date of right", currentDate, returningDate);
        dispatch({
            type: INSTRUCTOR_RIGHT_DATE,
            payload: returningDate
        })
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

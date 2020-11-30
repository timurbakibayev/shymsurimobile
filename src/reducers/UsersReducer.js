import {
    ADD_INSTRUCTOR, EVENT_LOADED, INSTRUCTOR_DETAIL, INSTRUCTOR_DETAIL_ADD_EVENT, INSTRUCTOR_DETAIL_EVENT_END,
    INSTRUCTOR_DETAIL_EVENT_START, INSTRUCTOR_DETAIL_HIDE_EVENT, INSTRUCTOR_LEFT_DATE, INSTRUCTOR_NOTIFICATION,
    INSTRUCTOR_RELOAD,
    INSTRUCTOR_REPORT_END,
    INSTRUCTOR_REPORT_START, INSTRUCTOR_REPORT_SUCCESS, INSTRUCTOR_RIGHT_DATE,
    INSTRUCTOR_SHOW_REPORT, INSTRUCTOR_SKI, INSTRUCTOR_SNOWBOARD, INSTRUCTORS_CHANGE_SCREEN,
    INSTRUCTORS_CURRENT_DATE, INSTRUCTORS_RETURN_TO_INSTRUCTORS,
    INSTRUCTORS_SEARCHING_FOR, TRAINER_AT_WORK,
    TRAINERS_AT_WORK, USERS_LOADED,
    USERS_LOADED_ERROR,
    USERS_LOADING
} from "../actions/types";

const INITIAL_STATE = {
    showAddEvent: false,
    showAddReport: false,
    everything: '',
    instructorReportStart: '',
    instructorReportEnd: '',
    instructorEventStart: '',
    instructorEventEnd: '',
    instructorError: '',
    instructors: null,
    instructor: null,
    addinstructor: null,
    events: [],
    usersLoading: false,
    instructorsCurrentDate: '',
    trainersAtWork: [],
    lookingFor: null,
    reports: [],
    notification: null,
    reload: false,
    trainerAtWork: false,
    trainer: null,
    leftDate: '',
    rightDate: '',
    instructorSkillSki: false,
    instructorSkillSnowboard: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USERS_LOADED:
            return {...state, instructors: action.payload, usersLoading: false};
        case USERS_LOADED_ERROR:
            return {...state, instructorError: 'This is the end station', usersLoading: false};
        case INSTRUCTOR_DETAIL:
            return {...state, instructor: action.payload, usersLoading: false};
        case EVENT_LOADED:
            return {...state, events: action.payload, usersLoading: false, reload: false};
        case USERS_LOADING:
            return {...state, usersLoading: true};
        case ADD_INSTRUCTOR:
            return {...state, addinstructor: 'add', usersLoading: false};
        case TRAINERS_AT_WORK:
            return {...state, trainersAtWork: action.payload};
        case INSTRUCTORS_CURRENT_DATE:
            return {...state, instructorsCurrentDate: action.payload};
        case INSTRUCTORS_SEARCHING_FOR:
            return {...state, lookingFor: action.payload};
        case INSTRUCTOR_DETAIL_ADD_EVENT:
            return {...state, showAddEvent: true, showAddReport: false};
        case INSTRUCTOR_SHOW_REPORT:
            return {...state, showAddReport: true, showAddEvent: false};
        case INSTRUCTOR_REPORT_START:
            return {...state, instructorReportStart: action.payload};
        case INSTRUCTOR_REPORT_END:
            return {...state, instructorReportEnd: action.payload};
        case INSTRUCTOR_DETAIL_EVENT_START:
            if (action.datetime == "date")
                return {...state, instructorEventStartDate: action.payload, instructorDataLoading: false};
            else
                return {...state, instructorEventStartTime: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_DETAIL_EVENT_END:
            return {...state, instructorEventEnd: action.payload};
        case INSTRUCTOR_DETAIL_HIDE_EVENT:
            return {...state, showAddEvent: false};
        case INSTRUCTOR_REPORT_SUCCESS:
            return {...state, reports: action.payload, reload: false};
        case INSTRUCTOR_NOTIFICATION:
            return {...state, notification: action.payload};
        case INSTRUCTOR_RELOAD:
            return {...state, events: [], reload: true};
        case TRAINER_AT_WORK:
            return {...state, trainerAtWork: action.payload};
        case INSTRUCTORS_CHANGE_SCREEN:
            return {...state, trainer: action.payload};
        case INSTRUCTORS_RETURN_TO_INSTRUCTORS:
            return {...state, trainer: null};
        case INSTRUCTOR_LEFT_DATE:
            return {...state, leftDate: action.payload};
        case INSTRUCTOR_RIGHT_DATE:
            return {...state, rightDate: action.payload};
        case INSTRUCTOR_SKI:
            return {...state, instructorSkillSki: action.payload, instructorSkillSnowboard: false};
        case INSTRUCTOR_SNOWBOARD:
            return {...state, instructorSkillSnowboard: action.payload, instructorSkillSki: false};
        default :
            return state;
    }
}
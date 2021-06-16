import {
    INSTRUCTOR_AT_WORK_FROM_SERVER,
    INSTRUCTOR_DATA_LOADING,
    INSTRUCTOR_DETAIL_TEXT,
    INSTRUCTOR_DETAIL_ADD_EVENT,
    INSTRUCTOR_DETAIL_EVENT_END,
    INSTRUCTOR_DETAIL_EVENT_START,
    INSTRUCTOR_DETAIL_HIDE_EVENT,
    INSTRUCTOR_ERROR_MESSAGE,
    INSTRUCTOR_EVENT_FAIL,
    INSTRUCTOR_EVENT_LOADING,
    INSTRUCTOR_EVENT_SUCCESS,
    INSTRUCTOR_LEFT_DATE,
    INSTRUCTOR_RELOAD,
    INSTRUCTOR_REPORT_END,
    INSTRUCTOR_REPORT_LOADING,
    INSTRUCTOR_REPORT_START,
    INSTRUCTOR_REPORT_SUCCESS,
    INSTRUCTOR_RIGHT_DATE,
    INSTRUCTOR_SHOW_REPORT,
    INSTRUCTOR_SKI,
    INSTRUCTOR_SNOWBOARD,
    INSTRUCTOR_TRAINERS_LOADED,
    INSTRUCTOR_TRAINERS_LOADED_ERROR,
    INSTRUCTORS_CURRENT_DATE,
    TRAINER_AT_WORK
} from "../actions/types";

const INITIAL_STATE = {
    instructorCurrentDate: '',
    instructorDataLoading: false,
    instructorEventsLoading: false,
    instructorReportsLoading: false,
    instructorLoadedTrainers: null,
    instructorLoadedError: '',
    instructorShowAddEventForm: false,
    instructorShowReportForm: false,
    instructorEventFail: false,
    instructorEventSuccess: [],
    reload: false,
    instructorReportStart: '',
    instructorReportEnd: '',
    reports: [],
    text: '',
    instructorEventStartDate: '',
    instructorEventStartTime: '',
    instructorEventEnd: '',
    trainerAtWork: false,
    leftDate: '',
    rightDate: '',
    instructorAtWork: [],
    instructorSkillSki: false,
    instructorSkillSnowboard: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INSTRUCTORS_CURRENT_DATE:
            return {...state, instructorCurrentDate: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_DATA_LOADING:
            return {...state, instructorDataLoading: true};
        case INSTRUCTOR_TRAINERS_LOADED:
            return {...state, instructorDataLoading: false, instructorLoadedTrainers: action.payload};
        case INSTRUCTOR_TRAINERS_LOADED_ERROR:
            return {...state, instructorDataLoading: false, instructorLoadedError: INSTRUCTOR_ERROR_MESSAGE};
        case INSTRUCTOR_DETAIL_ADD_EVENT:
            return {
                ...state,
                instructorShowAddEventForm: true,
                instructorShowReportForm: false,
                instructorDataLoading: false
            };
        case INSTRUCTOR_SHOW_REPORT:
            return {
                ...state,
                instructorShowAddEventForm: false,
                instructorShowReportForm: true,
                instructorDataLoading: false,
                instructorEventsLoading: false,
            };
        case INSTRUCTOR_EVENT_SUCCESS:
            return {
                ...state,
                instructorEventFail: false,
                instructorEventSuccess: action.payload,
                reload: false,
                instructorDataLoading: false,
                instructorEventsLoading: false,
            };
        case INSTRUCTOR_EVENT_FAIL:
            return {
                ...state,
                instructorEventFail: true,
                instructorEventSuccess: [],
                reload: false,
                instructorDataLoading: false,
                instructorEventsLoading: false,
            };
        case INSTRUCTOR_REPORT_LOADING:
            return {
                ...state,
                instructorReportsLoading: action.payload,
            };
        case INSTRUCTOR_EVENT_LOADING:
            return {...state, instructorEventSuccess: [], reload: false, instructorEventsLoading: true,
                instructorDataLoading: false};
        case INSTRUCTOR_RELOAD:
            return {...state, events: [], reload: true, instructorDataLoading: false};
        case INSTRUCTOR_REPORT_START:
            return {...state, instructorReportStart: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_REPORT_END:
            return {...state, instructorReportEnd: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_REPORT_SUCCESS:
            console.log("Success!!!");
            return {...state, reports: action.payload, reload: false, instructorDataLoading: false,
                instructorReportsLoading: false,
            };
        case INSTRUCTOR_DETAIL_TEXT:
            console.log("changing text", action.payload);
            return {...state, text: action.payload, instructorDataLoading: false };
        case INSTRUCTOR_DETAIL_EVENT_START:
            if (action.datetime == "date")
                return {...state, instructorEventStartDate: action.payload, instructorDataLoading: false};
            else
                return {...state, instructorEventStartTime: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_DETAIL_EVENT_END:
            return {...state, instructorEventEnd: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_DETAIL_HIDE_EVENT:
            return {...state, instructorShowAddEventForm: false, instructorDataLoading: false, reload: true};
        case TRAINER_AT_WORK:
            return {...state, trainerAtWork: action.payload, instructorAtWork: [], instructorDataLoading: false};
        case INSTRUCTOR_LEFT_DATE:
            return {...state, leftDate: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_RIGHT_DATE:
            return {...state, rightDate: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_AT_WORK_FROM_SERVER:
            return {...state, instructorAtWork: action.payload, instructorDataLoading: false};
        case INSTRUCTOR_SKI:
            return {...state, instructorSkillSki: action.payload, instructorSkillSnowboard: false};
        case INSTRUCTOR_SNOWBOARD:
            return {...state, instructorSkillSnowboard: action.payload, instructorSkillSki: false};
        default :
            return state;
    }
}
import {
    INSTRUCTOR_CURRENT_DATE,
    INSTRUCTOR_DETAIL_ADD_EVENT, INSTRUCTOR_DETAIL_EVENT_END,
    INSTRUCTOR_DETAIL_EVENT_START, INSTRUCTOR_DETAIL_HIDE_EVENT, INSTRUCTOR_EVENTS_ON_DATE, INSTRUCTOR_RELOAD,
    INSTRUCTOR_REPORT_END,
    INSTRUCTOR_REPORT_START,
    INSTRUCTOR_REPORT_SUCCESS,
    INSTRUCTOR_SHOW_REPORT
} from "../actions/types";

const INITIAL_STATE = {
    showAddEvent: false,
    instructorEventStart: '',
    instructorEventEnd: '',
    showAddReport: false,
    instructorReportStart: '',
    instructorReportEnd: '',
    reports: [],
    instructorCurrentDate: '',
    instructorEventsOnDate: [],
    reload: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INSTRUCTOR_DETAIL_ADD_EVENT:
            return {...state, showAddEvent: true, showAddReport: false};
        case INSTRUCTOR_SHOW_REPORT:
            return {...state, showAddReport: true, showAddEvent: false};
        case INSTRUCTOR_DETAIL_EVENT_START:
            return {...state, instructorEventStart: action.payload};
        case INSTRUCTOR_DETAIL_EVENT_END:
            return {...state, instructorEventEnd: action.payload};
        case INSTRUCTOR_DETAIL_HIDE_EVENT:
            return {...state, showAddEvent: false};
        case INSTRUCTOR_REPORT_START:
            return {...state, instructorReportStart: action.payload};
        case INSTRUCTOR_REPORT_END:
            return {...state, instructorReportEnd: action.payload};
        case INSTRUCTOR_REPORT_SUCCESS:
            return {...state, reports: action.payload};
        case INSTRUCTOR_CURRENT_DATE:
            return {...state, instructorCurrentDate: action.payload};
        case INSTRUCTOR_EVENTS_ON_DATE:
            return {...state, instructorEventsOnDate: action.payload, reload: false};
        case INSTRUCTOR_RELOAD:
            return {...state, instructorEventsOnDate: [], reload: true};
        default :
            return state;
    }
}
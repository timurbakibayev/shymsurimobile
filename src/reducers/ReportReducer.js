import {
    REPORT_END_DATE, REPORT_FAIL, REPORT_START_DATE, REPORT_SUCCESS,
    REPORT_TRAINERS_SUCCESS
} from "../actions/types";

const INITIAL_STATE = {
    startDate: '', endDate: '', report: [], reportError: false, reportInstructors: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REPORT_START_DATE:
            return {...state, startDate: action.payload};
        case REPORT_END_DATE:
            return {...state, endDate: action.payload};
        case REPORT_SUCCESS:
            return {...state, report: action.payload, reportError: false};
        case REPORT_FAIL:
            return {...state, reportError: true, report: []};
        case REPORT_TRAINERS_SUCCESS:
            return {...state, reportInstructors: action.payload};
        default :
            return state;
    }
}
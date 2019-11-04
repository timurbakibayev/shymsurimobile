import {
    TRAINING_ADD_DATE_END,
    TRAINING_ADD_DATE_START, TRAINING_ADD_DESCRIPTION, TRAINING_ADD_SKI,
    TRAINING_ADD_SNOWBORAD
} from "../actions/types";

const INITIAL_STATE = {
    trainingAddSki: false, trainingAddSnowboard: false, trainingDescription: '',
    trainingTimeDateStart: "", trainingTimeDateEnd: ""
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TRAINING_ADD_SNOWBORAD:
            return {...state, trainingAddSnowboard: action.payload};
        case TRAINING_ADD_SKI:
            return {...state, trainingAddSki: action.payload};
        case TRAINING_ADD_DESCRIPTION:
            return {...state, trainingDescription: action.payload};
        case TRAINING_ADD_DATE_START:
            return {...state, trainingTimeDateStart: action.payload};
        case TRAINING_ADD_DATE_END:
            return {...state, trainingTimeDateEnd: action.payload};
        default :
            return state;
    }
}
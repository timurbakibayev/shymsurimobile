import {
    TAKEN_TRAINER_SUCCESS, TAKEN_TRAINER_FAIL, TAKEN_CHOSEN_TRAINER_DATE_START,
    TAKEN_CHOSEN_TRAINER_DATE_END
} from "../actions/types";

const INITIAL_STATE = {loadedEvents: [], loadedEventsFail: false, chosenStartDate: '', chosenEndDate: ''};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TAKEN_TRAINER_SUCCESS:
            return {...state, loadedEvents: action.payload, loadedEventsFail: false};
        case TAKEN_TRAINER_FAIL:
            return {...state, loadedEvents: [], loadedEventsFail: true};
        case TAKEN_CHOSEN_TRAINER_DATE_START:
            return {...state, chosenStartDate: action.payload};
        case TAKEN_CHOSEN_TRAINER_DATE_END:
            return {...state, chosenEndDate: action.payload};
        default :
            return state;
    }
}
import {
    TRAINER_LANGUAGE_ENGLISH,
    TRAINER_LANGUAGE_KAZAKH, TRAINER_LANGUAGE_RUSSIAN, TRAINER_NAME_CHANGED, TRAINER_PHONE_CHANGED,
    TRAINER_RATING_CHANGED, TRAINER_SKI, TRAINER_SNOWBOARD
} from "../actions/types";

const INITIAL_STATE = {
    trainerName: '', trainerPhone: '', trainerRating: '',
    trainerKazakh: false, trainerRussian: false, trainerEnglish: false,
    trainerSkillSki: false, trainerSkillSnowboard: false,
    error: '', isLoading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TRAINER_NAME_CHANGED:
            return {...state, trainerName: action.payload};
        case TRAINER_PHONE_CHANGED:
            return {...state, trainerPhone: action.payload};
        case TRAINER_RATING_CHANGED:
            return {...state, trainerRating: action.payload};
        case TRAINER_LANGUAGE_KAZAKH:
            return {...state, trainerKazakh: action.payload};
        case TRAINER_LANGUAGE_RUSSIAN:
            return {...state, trainerRussian: action.payload};
        case TRAINER_LANGUAGE_ENGLISH:
            return {...state, trainerEnglish: action.payload};
        case TRAINER_SKI:
            return {...state, trainerSkillSki: action.payload};
        case TRAINER_SNOWBOARD:
            return {...state, trainerSkillSnowboard: action.payload};
        default :
            return state;
    }
}
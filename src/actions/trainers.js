import {
    TRAINER_LANGUAGE_ENGLISH, TRAINER_LANGUAGE_KAZAKH, TRAINER_LANGUAGE_RUSSIAN, TRAINER_NAME_CHANGED,
    TRAINER_PHONE_CHANGED,
    TRAINER_RATING_CHANGED, TRAINER_SKI, TRAINER_SNOWBOARD, URL
} from "./types";
// import {URL} from "../const";

export const addTrainer = ({
                               user, trainerName,
                               trainerPhone,
                               trainerRating,
                               trainerKazakh,
                               trainerEnglish,
                               trainerRussian,
                               trainerSkillSki,
                               trainerSkillSnowboard
                           }) => {
    return (dispatch) => {
        fetch(`${URL}trainers/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            },
            body:
                JSON.stringify({
                    name: trainerName,
                    ski: trainerSkillSki,
                    board: trainerSkillSnowboard,
                    rating: trainerRating,
                    languages: "eng",
                    kaz: trainerKazakh,
                    rus: trainerRussian,
                    eng: trainerEnglish,
                    phone: trainerPhone,
                    top_ski: true,
                    top_board: true,
                    photo: "none",
                    at_work: false
                })
        }).then((response) => response.json())
            .then((success) => console.log(success))
            .catch((error) => console.log(error));
    }
};


export const trainerNameChanged = (text) => {
    return {
        type: TRAINER_NAME_CHANGED,
        payload: text
    }
};


export const trainerPhoneChanged = (text) => {
    return {
        type: TRAINER_PHONE_CHANGED,
        payload: text
    }
};

export const trainerRatingChanged = (text) => {
    return {
        type: TRAINER_RATING_CHANGED,
        payload: text
    }
};


export const trainerLanguageKazakh = (trainerKazakh) => {
    if (trainerKazakh) {
        return {
            type: TRAINER_LANGUAGE_KAZAKH,
            payload: false
        }
    } else {
        return {
            type: TRAINER_LANGUAGE_KAZAKH,
            payload: true
        }
    }
};

export const trainerLanguageEnglish = (trainerEnglish) => {
    if (trainerEnglish) {
        return {
            type: TRAINER_LANGUAGE_ENGLISH,
            payload: false
        }
    } else {
        return {
            type: TRAINER_LANGUAGE_ENGLISH,
            payload: true
        }
    }
};

export const trainerLanguageRussian = (trainerRussian) => {
    if (trainerRussian) {
        return {
            type: TRAINER_LANGUAGE_RUSSIAN,
            payload: false
        }
    } else {
        return {
            type: TRAINER_LANGUAGE_RUSSIAN,
            payload: true
        }
    }
};


export const trainerSki = (trainerSkillSki) => {
    if (trainerSkillSki) {
        return {
            type: TRAINER_SKI,
            payload: false
        }
    } else {
        return {
            type: TRAINER_SKI,
            payload: true
        }
    }
};

export const trainerSnowboard = (trainerSkillSnowboard) => {
    if (trainerSkillSnowboard) {
        return {
            type: TRAINER_SNOWBOARD,
            payload: false
        }
    } else {
        return {
            type: TRAINER_SNOWBOARD,
            payload: true
        }
    }
};
import {
    TRAINING_ADD_DATE_END, TRAINING_ADD_DATE_START, TRAINING_ADD_DESCRIPTION, TRAINING_ADD_SKI,
    TRAINING_ADD_SNOWBORAD, URL
} from "./types";
// import {URL} from "../const";

export const trainingSnowboard = (trainingAddSnowboard) => {
    if (trainingAddSnowboard) {
        return {
            type: TRAINING_ADD_SNOWBORAD,
            payload: false
        }
    } else {
        return {
            type: TRAINING_ADD_SNOWBORAD,
            payload: true
        }
    }
};

export const trainingSki = (trainingAddSki) => {
    if (trainingAddSki) {
        return {
            type: TRAINING_ADD_SKI,
            payload: false
        }
    } else {
        return {
            type: TRAINING_ADD_SKI,
            payload: true
        }
    }
};


export const descriptionChanged = (text) => {
    return {
        type: TRAINING_ADD_DESCRIPTION,
        payload: text
    }
};


export const trainingDateStart = (date) => {
    return {
        type: TRAINING_ADD_DATE_START,
        payload: date
    }
};

export const trainingDateEnd = (date) => {
    return {
        type: TRAINING_ADD_DATE_END,
        payload: date
    }
};


export const addEventToServer = ({user, trainingAddSki, trainingAddSnowboard, trainingDescription, trainingTimeDateStart, trainingTimeDateEnd}) => {
    return (dispatch) => {
        fetch(`${URL}events/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            },
            body:
                JSON.stringify({
                    start: trainingTimeDateStart,
                    end: trainingTimeDateEnd,
                    text: trainingDescription,
                    approved: true,
                    resource: 1,
                    ski: trainingAddSki,
                    board: trainingAddSnowboard,
                    tarif: 1,
                    tarif_txt: "",
                    cssClass: "my-event",
                    resizeDisabled: false,
                    backColor: "#F7F7F9",
                    own_client: true
                })
        }).then((response) => response.json())
            .then((success) => console.log(success))
            .catch((error) => console.log(error));
    }
};
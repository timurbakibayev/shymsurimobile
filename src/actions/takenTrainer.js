import {TAKEN_TRAINER_FAIL, TAKEN_TRAINER_SUCCESS, URL} from "./types";
// import {URL} from "../const";

export const getTakenTrainerOnDate = (user, date) => {
    return (dispatch) => {
        fetch(`${URL}events/?date=${date}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${ user.token }`
            }
        }).then((response) => response.json())
            .then((takenInstructors) => takenTrainerSuccess(dispatch, takenInstructors))
            .catch(() => takenTrainerFail(dispatch));
    }
};


const takenTrainerSuccess = (dispatch, takenInstructors) => {
    let result = [];
    let resultIndexes = [];
    for(let i in takenInstructors){
        let dateTime = takenInstructors[i].start.split(" ");
        if(dateTime.length < 2){
            dateTime = takenInstructors[i].start.split("T");
        }
        result.push([dateTime[0], dateTime[1], takenInstructors[i].tarif_txt]);
        resultIndexes.push(i+1);
    }
    console.log("This is object in array ", result);
    dispatch({
        type: TAKEN_TRAINER_SUCCESS,
        payload: result
    });

};

const takenTrainerFail = (dispatch) => {
    dispatch({type: TAKEN_TRAINER_FAIL});
};
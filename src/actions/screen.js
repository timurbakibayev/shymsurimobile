import {SCREEN_CHANGE, SCREEN_LOAD_USER} from "./types";


export const navigateScreen = (url) => {
    return (dispatch) => {
        dispatch(
            {
                type: SCREEN_CHANGE,
                screen: url,
            }
        )
    };
};

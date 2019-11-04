import {SCREEN_CHANGE} from "../actions/types";

const INITIAL_STATE = {url: "home"};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SCREEN_CHANGE:
            return {url: action.screen};
        default :
            return state;
    }
}
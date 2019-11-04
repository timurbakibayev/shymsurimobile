import {
    USER_NAME_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER,
    USER_LOGOUT, USER_LOGGED_IN
} from "../actions/types";

const INITIAL_STATE = {
    userName: '',
    password: '',
    error: '',
    isLoading: false,
    user: "",
    isLoggedIn: false,
    loggedOut: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_NAME_CHANGED:
            return {...state, userName: action.payload, loggedOut: false};
        case PASSWORD_CHANGED:
            return {...state, password: action.payload, loggedOut: false};
        case LOGIN_USER_SUCCESS:
            return {...state, ...INITIAL_STATE, user: action.payload, isLoggedIn: true, loggedOut: false};
        case LOGIN_USER_FAIL:
            return {
                ...state,
                error: 'Неверный логин или пароль',
                password: '',
                isLoading: false,
                isLoggedIn: false,
                loggedOut: false
            };
        case LOGIN_USER:
            return {...state, error: '', isLoading: 'true', isLoggedIn: false, loggedOut: false};
        case USER_LOGGED_IN:
            return {...state, isLoggedIn: true, loggedOut: false};
        case USER_LOGOUT:
            return {...state, isLoggedIn: false, user: '', loggedOut: true};
        default :
            return state;
    }
}
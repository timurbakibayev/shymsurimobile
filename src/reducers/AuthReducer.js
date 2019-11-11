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
            console.log('LOGIN_USER_SUCCESS event');
            return {...state, ...INITIAL_STATE, user: action.payload, isLoggedIn: true, loggedOut: false};
        case LOGIN_USER_FAIL:
            console.log('LOGIN_USER_FAIL event');
            return {
                ...state,
                error: 'Неверный логин или пароль',
                password: '',
                isLoading: false,
                isLoggedIn: false,
                loggedOut: false
            };
        case LOGIN_USER:
            console.log('LOGIN_USER event');
            return {...state, error: '', isLoading: 'true', isLoggedIn: false, loggedOut: false};
        case USER_LOGGED_IN:
            console.log('USER_LOGGED_IN event');
            return {...state, isLoggedIn: true, loggedOut: false};
        case USER_LOGOUT:
            console.log('USER_LOGOUT event');
            return {...state, isLoggedIn: false, user: '', loggedOut: true};
        default :
            return state;
    }
}
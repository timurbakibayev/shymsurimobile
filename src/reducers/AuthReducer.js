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
            return {...state, userName: action.payload, loggedOut: false, error: ''};
        case PASSWORD_CHANGED:
            return {...state, password: action.payload, loggedOut: false, error: ''};
        case LOGIN_USER_SUCCESS:
            console.log('LOGIN_USER_SUCCESS event');
            return {...state, ...INITIAL_STATE, user: action.payload, error: 'Login Success', isLoading: false, isLoggedIn: true, loggedOut: false};
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
        case "error":
            return {
                ...state,
                error: action.payload,
            };
        case LOGIN_USER:
            console.log('LOGIN_USER event');
            return {...state, error: 'Logging in...', isLoading: true, isLoggedIn: false, loggedOut: false};
        case USER_LOGGED_IN:
            console.log('USER_LOGGED_IN event');
            return {...state, isLoggedIn: true, error: 'Logged in...', loggedOut: false,  isLoading: false, };
        case USER_LOGOUT:
            console.log('USER_LOGOUT event');
            return {...state, isLoggedIn: false, error: 'Logged Out...', user: '', loggedOut: true};
        default :
            return state;
    }
}
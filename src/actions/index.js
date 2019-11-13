import {Permissions, Notifications} from 'expo';
import {
    USER_NAME_CHANGED, PASSWORD_CHANGED, LOGIN_USER_SUCCESS, LOGIN_USER_FAIL, LOGIN_USER,
    USERS_LOADING, USER_LOGOUT, USER_LOGGED_IN, URL
} from "./types";
import {AsyncStorage} from "react-native";
import "whatwg-fetch";

export const userNameChanged = text => ({
    type: USER_NAME_CHANGED,
    payload: text
});


export const passwordChanged = text => ({
    type: PASSWORD_CHANGED,
    payload: text
});

export const setUserLoggedIn = () => ({type: USER_LOGGED_IN});

export const loginUser = ({userName, password}) => {
    return async (dispatch) => {
        dispatch({type: LOGIN_USER});
        console.log("This is user login password", userName, password, `${URL}auth/`);
        // Notifications.getExpoPushTokenAsync()
        //     .then((token) => {
        //         console.log("This is a token ", token);
        dispatch({type: "error", payload: "one"});
        let response = '';
        let the_body = JSON.stringify({
                        password: password,
                        username: userName,
                        // device_id: token
                        device_id: ""
                    });
        dispatch({type: "error", payload: "Loading..."});
        try {
            response = await fetch(`${URL}auth/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:
                    the_body
            });
        } catch (e) {
            dispatch({type: "error", payload: e.message});
        }

        const user = await response.json();
        dispatch({type: "error", payload: JSON.stringify(user)});
        loginUserSuccess(dispatch, user);
        // }).catch(error => console.log("This is token error ", error));
        // fetch("http://shymbulak.papers.kz/auth/", {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body:
        //         JSON.stringify({
        //             password: password,
        //             username: userName,
        //             device_id: token
        //         })
        // }).then((response) => response.json())
        //     .then((user) => loginUserSuccess(dispatch, user))
        //     .catch(() => loginUserFailed(dispatch));


    }
};

export const logOut = () => {
    AsyncStorage.setItem("token", "");
    return({type: USER_LOGOUT});
};

async function registerForPushNotificationsAsync() {
    const {status: existingStatus} = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync().then((response) => console.log("This is toke response", response));
    console.log("this is toke on push", token);
    return token;
}

const loginUserFailed = (dispatch) => {
    dispatch({type: LOGIN_USER_FAIL});
};

const loginUserSuccess = (dispatch, user) => {
    if (user.token) {
        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: user
        })
    } else {
        loginUserFailed(dispatch)
    }
};



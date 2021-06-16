import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
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
        const token = await registerForPushNotificationsAsync();
        console.log("This is a push token ", token);
        dispatch({type: "error", payload: "one"});
        let response = '';
        let the_body = JSON.stringify({
                        password: password,
                        username: userName,
                        device_id: token
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
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return "";
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
    return "";
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

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



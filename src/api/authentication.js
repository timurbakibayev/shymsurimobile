import {URL} from './url'
export async function loginUser(creds) {
    console.log("Starting authentication");

    let response = await fetch(
        `${URL}logout.html`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include',
        }
    );
    console.log("Status logout.html",response.status);
    response = await fetch(
        `${URL}home.html`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include',
        }
    );
    console.log("Status home.html",response.status);
    response = await fetch(
        `${URL}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include',
        }
    );
    //console.log("Response to main page", response);
    const text = await response.text();
    console.log("Status main",response.status);
    //console.log(response["set-cookie"]);

    response = await fetch(
        `${URL}/login`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            mode: 'same-origin',
            credentials: 'include',
            body: "username=t.bakibaev&password=Akoda5918",
        }
    );
    //console.log("Response to login", response);
    const text2 = await response.text();
    console.log("Status login",response.status);
    //console.log("Text",text2);

    response = await fetch(
        `${URL}/users/info`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            mode: 'same-origin',
            credentials: 'include',
        }
    );
    //console.log("Response to login", response);
    const text3 = await response.text();
    console.log("Status info",response.status); //405 = broken
    console.log("Text",text3);
}
//
// export function userDetail(creds, token) {
//     return fetch(
//         `${URL}/api/user_by_name/${creds.username}/`,
//         {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `JWT ${ token }`
//             }
//         }
//     )
// }
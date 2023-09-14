function goTo(url) {
    window.location.href = url;
}

user = {
    name: '',
    birthdate: '',
    email: '',
    password: '' //Ind1gitall_
}

const eventsType = Object.freeze({step1: "step1", step2: "step2", step3: "newUser"});

// Para registrar eventos:
function subEvent(evenType, customData = {}, async = false) {
    indigitall.sendCustomEvent({
        eventType: evenType,
        customData: customData, // add your data
        async: async, // call this event sync/async
    }, (response) => {
        console.log(response);
    }, (error) => {
        console.log(error);
    });
}

const topicsCodes = Object.freeze({step1: "incomplete_step1", step2: "incomplete_step2", step3: "incomplete_step3"});

function subTopic(topicCode) {
    indigitall.topicsSubscribe(topicCode);
}

// Remember to replace with the codes of your themes
function unsubTopic(topicCode) {
    indigitall.topicsUnsubscribe(topicCode, (topics) => {
        // success function
        console.log(topics);
    }, (error) => {
        console.log(error);
    });
}

function submitSignUpFirstStep(customData) {
    indigitall.topicsUnsubscribe([topicsCodes.step1]);
    indigitall.sendCustomEvent({
        eventType: eventsType.step1,
        customData: customData, // add your data
        async: false, // call this event sync/async
    }, (response) => {
        console.log(response);
        $('#step1').toggleClass('active');
        $('#step2').toggleClass('active');
    }, (error) => {
        console.log(error);
        alert('Ha ocurrido un error en el primer paso');
    });
}

function submitSignUpSecondStep(customData) {
    indigitall.topicsUnsubscribe([topicsCodes.step2]);
    indigitall.sendCustomEvent({
        eventType: eventsType.step2,
        customData: customData, // add your data
        async: false, // call this event sync/async
    }, (response) => {
        console.log(response);
        $('#step2').toggleClass('active');
        $('#newUser').toggleClass('active');
    }, (error) => {
        console.log(error);
        alert('Ha ocurrido un error en el segundo paso');
    });
}

function submitSignUpThirdStep(customData) {
    indigitall.topicsUnsubscribe([topicsCodes.step3]);
    indigitall.sendCustomEvent({
        eventType: eventsType.step3,
        customData: customData, // add your data
        async: false, // call this event sync/async
    }, (response) => {
        console.log(response);
        logIn();
    }, (error) => {
        console.log(error);
        alert('Ha ocurrido un error en el segundo paso');
    });
}

const MY_DEVICE_ID = "MY_DEVICE_ID";
// [IND]service-worker Received a push message {
//     "body": "Has abandonado el registro en el paso 1 y nos has completado el paso 2",
//         "icon": "https://storage.googleapis.com/prod-public-assets/apps/4607/images/APP4607-2aa72058090dd5c7.png",
//         "title": "Continúa el registro",
//         "action": {
//         "url": "https://indigitall.com/es/",
//             "type": "url",
//             "topics": [],
//             "destroy": true
//     },
//     "appKey": "94cb9c3e-0749-450f-8445-49bf2b269d8a",
//         "layout": "basic",
//         "timezone": "Europe/Madrid",
//         "requireInteraction": true,
//         "id": 296684187,
//         "sendingId": 122316697,
//         "campaignId": 1718375,
//         "journeyStateId": null,
//         "cjCurrentStateId": null,
//         "deviceId": "777ded1c-086f-4f0c-a6e3-d6bceb462efe"
// }

//Primero hay que inicializar el SDK de indigitall para que genere nuestro identificador (deviceId)
// y poder asociarlo con el ID personalizado que asocias al dispositivo.
function logIn() {
    indigitall.logIn(MY_DEVICE_ID, (device) => {
        console.log(device);
        localStorage.setItem('user', JSON.stringify(user));
        goTo('login.html');
    }, (error) => {
        console.log(error);
    });
}

function logOut() {
    //Disconnection
    indigitall.logout((device) => {
        console.log(device);
        Object.keys(user).forEach(data => user[data] = '');
        localStorage.user = JSON.stringify(user);
        goTo('index.html');
    }, (error) => {
        console.log(error);
    });
}


function validateEmail(email, email2) {
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.match(regexEmail)) {
        alert('El email no es válido');
        return false;
    } else if (!email2.match(regexEmail) && email !== email2) {
        alert('El email2 no es válido o no es igual a email');
        return false;
    }
    return true;
}

function validatePassword(password, password2) {
    if (password.length < 8) {
        alert('La longitud de la contraseña no alcanza los 8 caracteres');
        return false;
    }
    // Verificar si contiene al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
        alert('La contraseña no tiene una mayúscula')
        return false;
    }

    if (!/[a-z]/.test(password)) {
        alert('La contraseña no tiene una minúscula');
        return false;
    }

    if (!/[0-9]/.test(password)) {
        alert('La contraseña no tiene un número');
        return false;
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
        alert('La contraseña no tiene un caracter especial');
        return false;
    }

    if (password !== password2) {
        alert('No has escrito la misma contraseña');
        return false;
    }
    return true;
}
importScripts(

  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"

);

importScripts(

  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"

);

firebase.initializeApp({

  apiKey:
    "AIzaSyCsa0yhXgavOs9gm92e8NCiJe5np4SKMGw",

  authDomain:
    "amdox-erp-cf808.firebaseapp.com",

  projectId:
    "amdox-erp-cf808",

  messagingSenderId:
    "905266107904",

  appId:
    "1:905266107904:web:314ef5598957d2a73d2ae5",

});

const messaging =
  firebase.messaging();

messaging.onBackgroundMessage(

  (payload) => {

    self.registration.showNotification(

      payload.notification.title,

      {

        body:
          payload.notification.body,

      }

    );

  }

);
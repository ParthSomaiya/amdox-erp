import { initializeApp } from "firebase/app";

import {
  getMessaging,
  getToken,
} from "firebase/messaging";

const firebaseConfig = {

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

};

const app =
  initializeApp(
    firebaseConfig
  );

export const messaging =
  getMessaging(app);

export const generateToken =
  async () => {

    const token =
      await getToken(

        messaging,

        {

          vapidKey:
            "BARolCfvBeXuPD_ZlTihq2HwW4j1QLKuLwIZCXvdczoB5CoyVYjm-tJIKVFHcjj8oYpjA_eNdQ56K1kTwQyRm0s",

        }

      );

    return token;

  };
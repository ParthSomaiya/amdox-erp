import {
  useEffect,
} from "react";

import {
  generateToken,
} from "../firebase";

export default function PushSetup() {

  useEffect(() => {

    generateToken()

      .then((token) => {

        console.log(
          "FCM TOKEN:",
          token
        );

      });

  }, []);

  return null;

}
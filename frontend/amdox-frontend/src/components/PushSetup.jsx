import { useEffect } from "react";
import { generateToken } from "../firebase";

export default function PushSetup() {
  useEffect(() => {
    // 🔹 પરમિશન બ્લોક હોય ત્યારે અનિચ્છનીય એરર અટકાવવા માટે સેફ્ટી ગાર્ડ
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "denied") {
        console.warn("FCM: Push notifications are blocked by the user.");
        return;
      }

      if (Notification.permission === "granted") {
        generateToken()
          .then((token) => {
            if (token) console.log("FCM TOKEN:", token);
          })
          .catch((err) => {
            console.warn("FCM: Token generation skipped due to blocked permissions.", err.message);
          });
      } else if (Notification.permission === "default") {
        // જો પરમિશન પૂછવાની બાકી હોય તો જ વિનંતી કરવી
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            generateToken()
              .then((token) => {
                if (token) console.log("FCM TOKEN:", token);
              })
              .catch((err) => {
                console.warn("FCM: Token generation skipped.", err.message);
              });
          }
        });
      }
    }
  }, []);

  return null;
}
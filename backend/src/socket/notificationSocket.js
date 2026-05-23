import admin from "../config/firebase.js";

export const sendPushNotification = async (
  token,
  title,
  body
) => {
  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
    },
  });
};
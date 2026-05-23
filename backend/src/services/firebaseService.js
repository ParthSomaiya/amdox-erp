import admin from "../config/firebase.js";

export const sendPush = async (token, title, body) => {
  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
    },
  });
};
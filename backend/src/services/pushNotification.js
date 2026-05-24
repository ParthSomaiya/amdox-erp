import admin from "../config/firebase.js";

export const sendPushNotification =
  async ({

    token,
    title,
    body,

  }) => {

    try {

      const message = {

        notification: {

          title,
          body,

        },

        token,

      };

      const response =
        await admin.messaging().send(
          message
        );

      console.log(
        "✅ Push Sent:",
        response
      );

      return response;

    } catch (err) {

      console.log(
        "❌ Push Error:",
        err.message
      );

    }

  };
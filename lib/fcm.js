import admin from "firebase-admin";

if (!process.env.FCM_DRY_RUN && !admin.apps.length) {
  const creds = JSON.parse(Buffer.from(process.env.FIREBASE_CREDENTIALS_B64, "base64").toString("utf8"));
  admin.initializeApp({ credential: admin.credential.cert(creds) });
}

export async function sendFCM(token, payload) {
  if (process.env.FCM_DRY_RUN === "true") {
    console.log("Dry run FCM:", token, payload);
    return;
  }
  if (token) await admin.messaging().send({ token, notification: payload });
  else await admin.messaging().sendToTopic("orders", { notification: payload });
}

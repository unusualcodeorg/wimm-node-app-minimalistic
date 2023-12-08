import * as admin from 'firebase-admin';
import path from 'path';
import { BadTokenError, InternalError } from '../core/ApiError';
import { firebase } from '../config';

admin.initializeApp({
  credential: admin.credential.cert(path.join(__dirname, '../../keys/service-account-file.json')),
  databaseURL: firebase.dbUrl,
});

export async function verifyToken(firebaseToken: string) {
  try {
    return await admin.auth().verifyIdToken(firebaseToken);
  } catch (e) {
    throw new BadTokenError('The firebase token is invalid');
  }
}

export type NotificationData = {
  type: string;
  ticker: string;
  title: string;
  subtitle: string;
  message: string;
  thumbnail: string;
  date: string;
  action: string;
  resource: string;
};

export async function sendNotificationToSingle(
  data: NotificationData,
  token: string,
  dryrun = true,
) {
  try {
    return await admin.messaging().send(
      {
        data: { ...data },
        token: token,
      },
      dryrun,
    );
  } catch (e) {
    // @ts-ignore
    throw new InternalError(e.message);
  }
}

export async function sendNotificationToMany(
  list: Array<{ data: NotificationData; token: string }>,
  dryrun = true,
) {
  try {
    return await admin.messaging().sendAll(
      list.map((entry) => ({ ...entry })),
      dryrun,
    );
  } catch (e) {
    // @ts-ignore
    throw new InternalError(e.message);
  }
}

export async function sendNotificationToMulti(
  data: NotificationData,
  tokens: string[],
  dryrun = true,
) {
  try {
    return await admin.messaging().sendMulticast(
      {
        data: { ...data },
        tokens: tokens,
      },
      dryrun,
    );
  } catch (e) {
    // @ts-ignore
    throw new InternalError(e.message);
  }
}

export async function sendNotificationToTopic(
  data: NotificationData,
  topic: string,
  dryrun = true,
) {
  try {
    return await admin.messaging().send(
      {
        data: { ...data },
        topic: topic,
      },
      dryrun,
    );
  } catch (e) {
    // @ts-ignore
    throw new InternalError(e.message);
  }
}

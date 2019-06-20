import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
export const increaseFrameUserPictureCount = functions.firestore.document('frames/{frameId}/images/{imageId}')
    .onCreate((snap, context) => {
        const newData = snap.data();
        if (newData !== undefined) {
            const userId = newData.ownerId;
            return admin.firestore().doc(`frames/${context.params.frameId}/userInfo/${context.params.frameId}`).update({
                [`users.${userId}.pictureCount`]: admin.firestore.FieldValue.increment(1)
            });
        } else {
            return null;
        }
    });

export const decreaseFrameUserPictureCount = functions.firestore.document('frames/{frameId}/images/{imageId}')
    .onDelete((snap, context) => {
        const newData = snap.data();
        if (newData !== undefined) {
            const userId = newData.ownerId;
            return admin.firestore().doc(`frames/${context.params.frameId}/userInfo/${context.params.frameId}`).update({
                [`users.${userId}.pictureCount`]: admin.firestore.FieldValue.increment(-1)
            });
        } else {
            return null;
        }
    });

export const createOpenAccessToken = functions.https.onCall((data, context) => {
    if (context !== undefined && context.auth !== undefined && context.auth.uid !== undefined) {
        throw new functions.https.HttpsError('invalid-argument', 'Cannot be a signed-in user to use open access');
    }
    const password: unknown = data.password;
    const openAccessId: unknown = data.openAccessId;
    console.log('password', password);
    console.log('openAccessId', openAccessId);
    if (!(typeof password === 'string') || password.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'The password must be a string with length greater than 0');
    }
    if (!(typeof openAccessId === 'string') || openAccessId.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Open Access Id must be a string with length greater than 0');
    }

    const openAccessPath = `openaccess/${openAccessId}/password/${password}`
    const newToken = 'lpf-' + new Date().getMilliseconds().toString();
    admin.firestore().doc(`${openAccessPath}`).get()
    .then(doc => {
        if (doc.exists) {
            console.log('password matched, documented existed');
            return admin.firestore().doc(`${openAccessPath}`).set({
                tokens: [newToken]
            }, { merge: true })
        } else {
            throw new functions.https.HttpsError('invalid-argument', 'Password does not match');
        }
    })
    .then(() => {
        console.log('Updated password record with new token');
        return { token: newToken }
    })
    .catch(err => {
        return err;
    });
});
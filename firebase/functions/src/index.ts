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
    })

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
    })
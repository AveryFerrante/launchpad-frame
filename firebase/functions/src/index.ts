import { https } from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const uploadFile = https.onCall((data, context) => {
    let uid: string;
    if (context && context.auth && context.auth.uid) {
        uid = context.auth.uid;
    } else {
        throw new https.HttpsError('unauthenticated', 'Must be authenticated to call the function');
    }
    console.log('User was authed: ', uid);
    console.log(data);
    const file: File = data.file;
    console.log(file);
    return {
        text: 'did this work?'
    };
});

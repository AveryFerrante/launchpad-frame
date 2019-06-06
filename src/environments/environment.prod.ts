import { FirebaseConfig } from './firebaseConfig';

export const environment = {
  production: true,
  firebaseConfig: FirebaseConfig,
  userDatabase: 'users',
  usernameDatabase: 'usernames',
  frameDatabase: 'frames',
  frameUserSub: 'userInfo',
  frameImageSub: 'images',
  imageDatabase: 'images',
  imageFrameSub: 'frameInfo',
  notificationsDatabase: 'notifications',
  pictureCache: '60' // In seconds
};

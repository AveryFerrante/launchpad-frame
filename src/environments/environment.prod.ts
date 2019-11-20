import { FirebaseConfig } from './firebaseConfig';

export const environment = {
  production: true,
  firebaseConfig: FirebaseConfig,
  userDatabase: 'users',
  usernameDatabase: 'usernames',
  frameDatabase: 'frames',
  frameUserSub: 'userInfo',
  frameImageSub: 'images',
  frameAnonymousTokenSub: 'anonymousTokens',
  frameAnonymousImageSub: 'anonymousImages',
  imageDatabase: 'images',
  imageFrameSub: 'frameInfo',
  notificationsDatabase: 'notifications',
  openAccessDatabase: 'openaccess',
  openAccessTokenSub: 'activetokens',
  pictureCache: '60' // In seconds
};

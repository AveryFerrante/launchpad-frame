// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: 'AIzaSyAMql8Ih8IDxQ_18lM9I0vBYZ-e1UKBdGM',
    authDomain: 'launchpad-frame.firebaseapp.com',
    databaseURL: 'https://launchpad-frame.firebaseio.com',
    projectId: 'launchpad-frame',
    storageBucket: 'launchpad-frame.appspot.com',
    messagingSenderId: '213061866345'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

import firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyD9l9yIsNBd7YdFYUkHNOthgHHbJnZ_0LQ',
    authDomain: 'chat-app-605b2.firebaseapp.com',
    databaseURL: 'https://chat-app-605b2.firebaseio.com',
    projectId: 'chat-app-605b2',
    storageBucket: 'chat-app-605b2.appspot.com',
    messagingSenderId: '618027688727',
    appId: '1:618027688727:web:332ccbc45d225ede750d52',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth;
export const db = firebase.database();

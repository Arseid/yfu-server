const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');
const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: "AIzaSyDO1BV-DSM-aBekyWCWp3ppBSa2setwano",
    authDomain: "yfu-database.firebaseapp.com",
    projectId: "yfu-database",
    storageBucket: "yfu-database.appspot.com",
    messagingSenderId: "584129224707",
    appId: "1:584129224707:web:31eddf69ccfc84d39a2e36"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const serviceAccount = require('./yfu-database-firebase-adminsdk-n0u8r-e7d92959a6.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = { db, admin };

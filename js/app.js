var firebaseConfig = {
    apiKey: "AIzaSyDdmzaGN7Eg60g_evT-JUbMnP0Hd4h7vl4",
    authDomain: "olx-pk18.firebaseapp.com",
    databaseURL: "https://olx-pk18.firebaseio.com",
    projectId: "olx-pk18",
    storageBucket: "olx-pk18.appspot.com",
    messagingSenderId: "347156467683",
    appId: "1:347156467683:web:c3e72035d96eeecf"


};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const messaging = firebase.messaging();

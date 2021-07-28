import firebase from "firebase"

var firebaseConfig = {
    apiKey: "AIzaSyAKDobFgejH7h3YOQ49ImmCcEZnKAfU4TE",
    authDomain: "beeweb-c5dfa.firebaseapp.com",
    projectId: "beeweb-c5dfa",
    storageBucket: "beeweb-c5dfa.appspot.com",
    messagingSenderId: "403634708359",
    appId: "1:403634708359:web:c483e08c5d9cef600ffd22",
    measurementId: "G-HE4GRM91Z6"
};

const fire = firebase.initializeApp(firebaseConfig);
export default fire
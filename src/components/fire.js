import firebase from "firebase"

var firebaseConfig = {
    apiKey: "AIzaSyCO3b8QseTKoV9I36Cc18_L1P5csd3Fj5w",
    authDomain: "test-1d751.firebaseapp.com",
    projectId: "test-1d751",
    storageBucket: "test-1d751.appspot.com",
    messagingSenderId: "552451510023",
    appId: "1:552451510023:web:cd7fd48ee4dc075ab57fa2",
    measurementId: "G-W6M11GTQW8"
};

const fire = firebase.initializeApp(firebaseConfig);
export default fire
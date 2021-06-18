import firebase from "firebase";
const FirebaseConfig = {
  apiKey: "AIzaSyCNbWl5FfyYG1q4F5NBpF19ejTIJjBmVsQ",
  authDomain: "whatsapp-rn-mohzaib.firebaseapp.com",
  projectId: "whatsapp-rn-mohzaib",
  storageBucket: "whatsapp-rn-mohzaib.appspot.com",
  messagingSenderId: "594709476864",
  appId: "1:594709476864:web:6028678444c22014afcae5",
  measurementId: "G-V57JXFZM4D"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(FirebaseConfig)
}
export default firebase;
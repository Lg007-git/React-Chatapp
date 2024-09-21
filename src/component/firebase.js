import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQOgaUemzQ-jZP84Heb_A5IN3HmmKsIgg",
  authDomain: "chatapp-282c4.firebaseapp.com",
  projectId: "chatapp-282c4",
  storageBucket: "chatapp-282c4.appspot.com",
  messagingSenderId: "120592531393",
  appId: "1:120592531393:web:893d202b43656817f63940",
  measurementId: "G-777NGDFW79"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBC1vlZ2C91LPxovDVslMr4WpRjQV3EEC0",
  authDomain: "shopcode-20d6a.firebaseapp.com",
  projectId: "shopcode-20d6a",
  storageBucket: "shopcode-20d6a.firebasestorage.app",
  messagingSenderId: "1397339286",
  appId: "1:1397339286:web:0ab2db09eb007d871f3eb7",
  measurementId: "G-E8G7PTXQ0G"
};

const firebaseAppConfig = initializeApp(firebaseConfig);
export default firebaseAppConfig
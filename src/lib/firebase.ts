import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDO_G1bbQzMQHVbRjiDDRun-uIkOzLTwEM",
  authDomain: "gym-tracker-a72a3.firebaseapp.com",
  projectId: "gym-tracker-a72a3",
  storageBucket: "gym-tracker-a72a3.appspot.com",
  messagingSenderId: "406225995560",
  appId: "1:406225995560:web:303ac15a448a30653f721d",
  measurementId: "G-XC82SNY42F"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
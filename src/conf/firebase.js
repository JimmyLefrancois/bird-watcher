import { initializeApp } from 'firebase/app'
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_87nu_409WL2Cz82OQg1CoGzDeuEfeg4",
  authDomain: "bird-watcher-85fb3.firebaseapp.com",
  projectId: "bird-watcher-85fb3",
  storageBucket: "bird-watcher-85fb3.appspot.com",
  messagingSenderId: "985807872428",
  appId: "1:985807872428:web:6587e56a6b6c21e252da09",
  measurementId: "G-B40L12VDKL",
  auth: true
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const user = auth.currentUser

setPersistence(auth, browserLocalPersistence)

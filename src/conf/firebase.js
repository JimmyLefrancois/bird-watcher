import { initializeApp } from 'firebase/app'
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

console.log(import.meta.env)
console.log(firebaseConfig)
console.log(process.env)

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const user = auth.currentUser
export const db = getFirestore(firebaseApp);

initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider ('6Ld_HUUpAAAAAKMvI2Gz_jZgFlXihPNHrMdGyVFu'),
  isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
});

export async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

setPersistence(auth, browserLocalPersistence)

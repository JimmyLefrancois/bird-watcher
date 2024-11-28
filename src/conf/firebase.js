import { initializeApp } from 'firebase/app'
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { initializeFirestore, persistentSingleTabManager, persistentLocalCache } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyD_87nu_409WL2Cz82OQg1CoGzDeuEfeg4",
  authDomain: "bird-watcher-85fb3.firebaseapp.com",
  projectId: "bird-watcher-85fb3",
  storageBucket: "bird-watcher-85fb3.appspot.com",
  messagingSenderId: "985807872428",
  appId: "1:985807872428:web:6587e56a6b6c21e252da09",
  measurementId: "G-G-B40L12VDKL"
};

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
auth.languageCode = 'fr'
export const user = auth.currentUser

export const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
  }),
});

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

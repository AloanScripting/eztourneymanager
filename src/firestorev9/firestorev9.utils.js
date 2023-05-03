import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { 
  collection, 
  getFirestore 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZ3G09nuLCdqOqT1y_JLCkht3QRNLINas",
  authDomain: "ip-point-tracker.firebaseapp.com",
  databaseURL: "https://ip-point-tracker-default-rtdb.firebaseio.com",
  projectId: "ip-point-tracker",
  storageBucket: "ip-point-tracker.appspot.com",
  messagingSenderId: "601710268435",
  appId: "1:601710268435:web:f55076827f1d97fe136fe6",
  measurementId: "G-C6NGTG4S04"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const tournamentsRef = collection(db, "tournaments");

// Google Sign-in
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Facebook Sign-in
const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({ display: 'popup' });

export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const updateProfile = async (userAuth, displayName) => {
  if (!userAuth) return;

  try {
    await userAuth.updateProfile({
      displayName: displayName
    });
  } catch (error) {
    console.log('error updating user', error.message);
    throw error; // re-throw error so it can be caught by the calling function
  }
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = db.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export {
  auth,
  db,
  tournamentsRef,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,

};

export const firestore = db;

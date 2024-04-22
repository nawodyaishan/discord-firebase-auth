import { FirebaseOptions, initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { AppConfig } from './app-config';

export abstract class FirebaseConfig {
  public static firebaseConfig: FirebaseOptions = {
    apiKey: 'AIzaSyBlu96eh0wvr4llbYBSe_aR4tETW01-kQs',
    authDomain: 'discord-twitter-auth-demo.firebaseapp.com',
    projectId: 'discord-twitter-auth-demo',
    storageBucket: 'discord-twitter-auth-demo.appspot.com',
    messagingSenderId: '492805690395',
    appId: '1:492805690395:web:a07396289ad43544ad14be'
  };
}

export const firebaseApp = initializeApp(FirebaseConfig.firebaseConfig);
export const functions = getFunctions(firebaseApp);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

if (AppConfig.isLocalEmulatorMode) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectStorageEmulator(storage, 'localhost', 9199);
}

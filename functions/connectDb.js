import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import myCredentials from './credentials.js';

export default function connectDb() {
  if(getApps().length === 0) { // are we already connected?
    initializeApp({ // if not, connect
      credential: cert(myCredentials)
    });
  } // now we have access to the database
  return getFirestore();
}

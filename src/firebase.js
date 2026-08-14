import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDn8-_hwoyDpquySnwvFJAjA_IDQUz67bs",
  authDomain: "brisaperfumes-d1ad3.firebaseapp.com",
  projectId: "brisaperfumes-d1ad3",
  storageBucket: "brisaperfumes-d1ad3.firebasestorage.app",
  messagingSenderId: "1000196666963",
  appId: "1:1000196666963:web:86cf8ee45d554d1a1078a6",
}

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(
  (v) => String(v).startsWith('SUA_') || String(v).startsWith('SEU_'),
)

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

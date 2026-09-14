import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

function assertConfig() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase is not configured. Set VITE_FIREBASE_* environment variables.')
  }
}

export function getFirebaseApp() {
  assertConfig()
  if (!app) app = initializeApp(firebaseConfig)
  return app
}

export function getFirebaseAuth() {
  if (!auth) auth = getAuth(getFirebaseApp())
  return auth
}

export function getFirestoreDb() {
  if (!db) db = getFirestore(getFirebaseApp())
  return db
}

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "inkspire-ee290.firebaseapp.com",
  projectId: "inkspire-ee290",
  storageBucket: "inkspire-ee290.appspot.com",
  messagingSenderId: "407847317163",
  appId: "1:407847317163:web:55fc962502022af515d1ee",
};

export const app = initializeApp(firebaseConfig);

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBAG_MGv2CL_tXI0X0qsKGdHUgWLK7Pm64",
//   authDomain: "schoolproject-8517f.firebaseapp.com",
//   projectId: "schoolproject-8517f",
//   storageBucket: "schoolproject-8517f.firebasestorage.app",
//   messagingSenderId: "583239512583",
//   appId: "1:583239512583:web:d17b6b77d6551753f4b0a2",
//   measurementId: "G-BGFQ715PND"
// };

// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);



import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCJS2y4pgO03o2fJKeZn60KbJgHsp7hT9c",
  authDomain: "zatak-ee12e.firebaseapp.com",
  projectId: "zatak-ee12e",
  storageBucket: "zatak-ee12e.firebasestorage.app",
  messagingSenderId: "199763748264",
  appId: "1:199763748264:web:afcfbf2b2078199f34299d",
  measurementId: "G-DK426LLSCW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log("analytics-->",analytics)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
console.log("auth-->",auth.settings)
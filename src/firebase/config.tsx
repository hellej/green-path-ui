export const config = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: "green-paths.firebaseapp.com",
  databaseURL: "https://green-paths.firebaseio.com",
  projectId: "green-paths",
  storageBucket: "green-paths.appspot.com",
  messagingSenderId: process.env.REACT_APP_FB_MSG_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
}

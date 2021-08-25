import firebase from 'firebase/app'
import 'firebase/analytics'
import { config } from './config'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
  console.log('firebase initialized')
}

export const analytics = firebase.analytics()

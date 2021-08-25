import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import mapReducer from './reducers/mapReducer'
import airQualityLayerReducer from './reducers/airQualityLayerReducer'
import userLocationReducer from './reducers/userLocationReducer'
import notificationReducer from './reducers/notificationReducer'
import pathsReducer from './reducers/pathsReducer'
import pathListReducer from './reducers/pathListReducer'
import originReducer from './reducers/originReducer'
import destinationReducer from './reducers/destinationReducer'
import mapPopupReducer from './reducers/mapPopupReducer'
import visitorReducer from './reducers/visitorReducer'
import uiReducer from './reducers/uiReducer'

const reducer = combineReducers({
  map: mapReducer,
  airQualityLayer: airQualityLayerReducer,
  userLocation: userLocationReducer,
  notification: notificationReducer,
  paths: pathsReducer,
  pathList: pathListReducer,
  origin: originReducer,
  destination: destinationReducer,
  mapPopup: mapPopupReducer,
  visitor: visitorReducer,
  ui: uiReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store

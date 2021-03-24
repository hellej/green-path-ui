import { turf } from '../utils/index'
import { Action } from 'redux'
import { LngLat, PointFeature, PointFeatureCollection, UserLocationReducer } from '../types'

const geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 8000,
}
const initialUserLocation: UserLocationReducer = {
  watchId: 0,
  expireTime: '',
  error: null,
  lngLat: null,
  userLocFC: turf.asFeatureCollection([] as PointFeature[]),
  userLocHistory: [],
}

interface UserLocationAction extends Action {
  coords: [number, number]
  lngLat: LngLat
  userLocFC: PointFeatureCollection
  watchId: number
}

interface Position {
  coords: {
    latitude: number
    longitude: number
  }
}

const userLocationReducer = (
  store: UserLocationReducer = initialUserLocation,
  action: UserLocationAction,
): UserLocationReducer => {
  switch (action.type) {
    case 'START_TRACKING_USER_LOCATION':
      return {
        ...store,
        error: 'Waiting for location...',
      }

    case 'SET_WATCH_ID':
      return { ...store, watchId: action.watchId }

    case 'ERROR_IN_POSITIONING': {
      const error = store.userLocHistory.length > 0 ? null : 'Have you enabled location services?'
      return {
        ...store,
        error,
      }
    }
    case 'ZOOM_TO_USER_LOCATION':
    case 'UPDATE_USER_LOCATION': {
      return {
        ...store,
        userLocFC: action.userLocFC,
        lngLat: action.lngLat,
        userLocHistory: store.userLocHistory.concat([action.coords]),
      }
    }
    case 'RESET_USER_LOCATION':
      return initialUserLocation

    default:
      return store
  }
}

export const startTrackingUserLocation = () => {
  return (dispatch: any) => {
    dispatch({ type: 'START_TRACKING_USER_LOCATION' })
    dispatch(updateUserLocation())
  }
}

export const updateUserLocation = () => {
  return (dispatch: any) => {
    const geoError = () => {
      dispatch({ type: 'ERROR_IN_POSITIONING' })
    }
    const watchPosition = (pos: Position) => {
      const lng = pos.coords.longitude
      const lat = pos.coords.latitude
      const userLocFC = turf.asFeatureCollection([turf.asPoint([lng, lat])])
      dispatch({
        type: 'UPDATE_USER_LOCATION',
        lngLat: { lng, lat },
        coords: [lng, lat],
        userLocFC,
      })
    }
    const watchId = navigator.geolocation.watchPosition(watchPosition, geoError, geoOptions)
    console.log('geolocation watchId:', watchId)
    dispatch({ type: 'SET_WATCH_ID', watchId })
  }
}

export const zoomToUserLocation = (userLocation: UserLocationReducer) => {
  console.log('userLocation in zoom to user location', userLocation)
  return (dispatch: any) => {
    const handleNaviUserLocationZoom = (pos: Position) => {
      const lng = pos.coords.longitude
      const lat = pos.coords.latitude
      const userLocFC = turf.asFeatureCollection([turf.asPoint([lng, lat])])
      console.log('pos.coords', pos.coords)
      dispatch({
        type: 'ZOOM_TO_USER_LOCATION',
        lngLat: { lng, lat },
        coords: [lng, lat],
        userLocFC,
      })
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleNaviUserLocationZoom)
    }
    const currentUserLngLat = turf.getLngLatFromFC(userLocation.userLocFC)
    if (currentUserLngLat) {
      dispatch({
        type: 'ZOOM_TO_USER_LOCATION',
        lngLat: currentUserLngLat,
        userLocFC: userLocation.userLocFC,
      })
    }
    if (userLocation.watchId === 0) dispatch(startTrackingUserLocation())
  }
}

export default userLocationReducer

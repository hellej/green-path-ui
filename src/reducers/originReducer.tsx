import { Action } from 'redux'
import { ChangeEvent } from 'react'
import { closePopup } from './mapPopupReducer'
import { zoomToFC } from './mapReducer'
import { startTrackingUserLocation } from './userLocationReducer'
import { turf } from './../utils/index'
import { extentFeat, egOrigin } from './../constants'
import * as geocoding from './../services/geocoding'

export enum LocationType {
  ADDRESS = 'address',
  USER_LOCATION = 'user',
  MAP_LOCATION = 'map'
}

export enum OdType {
  ORIGIN = 'orig',
  DESTINATION = 'dest'
}

const initialOrigin: OriginReducer = {
  error: null,
  originInputText: process.env.NODE_ENV === 'development' ? egOrigin.properties.label : '',
  originObject: process.env.NODE_ENV === 'development' ? egOrigin as OdPlace : null,
  originOptions: [],
  originOptionsVisible: false,
  waitingUserLocOrigin: false
}

interface OdInputAction extends Action {
  originInputText: string,
  originOptions: GeocodingResult[],
  originObject: OdPlace,
  name: string,
  coords: [number, number],
  error: string | null
}

const originReducer = (store: OriginReducer = initialOrigin, action: OdInputAction): OriginReducer => {

  switch (action.type) {

    case 'UPDATE_ORIGIN_INPUT_VALUE':
      return {
        ...store,
        originInputText: action.originInputText,
        originObject: null,
        originOptionsVisible: true,
        waitingUserLocOrigin: false,
        error: null
      }

    case 'SET_ORIGIN_OPTIONS':
      return {
        ...store,
        originOptions: action.originOptions
      }

    case 'HIDE_ORIGIN_OPTIONS':
      return { ...store, originOptionsVisible: false }

    case 'TOGGLE_ORIGIN_OPTIONS':
      return { ...store, originOptionsVisible: !store.originOptionsVisible }

    case 'WAIT_FOR_USER_LOC_ORIGIN':
      return { ...store, originInputText: ' ', waitingUserLocOrigin: true }

    case 'SET_GEOCODED_ORIGIN':
      return {
        ...store,
        originObject: action.originObject,
        originInputText: action.name,
        originOptionsVisible: false,
        waitingUserLocOrigin: false,
        error: action.error
      }

    case 'SET_ORIGIN_TO_USER_LOCATION':
      return {
        ...store,
        originObject: action.originObject,
        originInputText: action.originObject.properties.label,
        waitingUserLocOrigin: false,
        error: action.error
      }

    case 'UPDATE_USER_LOCATION': {
      if (store.waitingUserLocOrigin) {
        const originObject = getOriginFromCoords(action.coords, LocationType.USER_LOCATION)
        const error = originWithinSupportedArea(originObject)
        return {
          ...store,
          originObject,
          originInputText: originObject.properties.label,
          waitingUserLocOrigin: false,
          error
        }
      } else {
        return store
      }
    }

    case 'SET_ORIGIN_FROM_MAP': {
      return {
        ...store,
        originObject: action.originObject,
        originInputText: action.originObject.properties.label,
        waitingUserLocOrigin: false,
        error: action.error
      }
    }

    case 'RESET_ORIGIN_INPUT':
      return { ...initialOrigin, originObject: null, originInputText: '' }

    default:
      return store
  }
}

const showingCoordinates = (inputText: string): boolean => {
  const numberCount = inputText.replace(/[^0-9]/g, '').length
  return numberCount > Math.round(inputText.length / 2)
}

export const setOriginInputText = (event: ChangeEvent<HTMLInputElement>) => {
  return async (dispatch: any) => {
    const originInputText = event.target ? event.target.value : ''
    dispatch({ type: 'UPDATE_ORIGIN_INPUT_VALUE', originInputText })
    if (originInputText.length > 2 && !showingCoordinates(originInputText)) {
      const originOptions = await geocoding.geocodeAddress(originInputText, 6)
      dispatch({ type: 'SET_ORIGIN_OPTIONS', originOptions })
    } else {
      dispatch({ type: 'SET_ORIGIN_OPTIONS', originOptions: [] })
    }
  }
}

export const setGeocodedOrigin = (place: GeocodingResult, destObject: OdPlace | null) => {
  return async (dispatch: any) => {
    const originObject = getOriginFromGeocodingResult(place)
    const error = originWithinSupportedArea(originObject)
    dispatch({ type: 'SET_GEOCODED_ORIGIN', originObject, name: place.properties.name, error })
    const odFc = turf.asFeatureCollection(destObject ? [originObject, destObject] : [originObject])
    dispatch(zoomToFC(odFc))
  }
}

export const setUsedOrigin = (originObject: OdPlace, destObject: OdPlace | null) => {
  return async (dispatch: any) => {
    originObject.properties.odType = OdType.ORIGIN
    const error = originWithinSupportedArea(originObject)
    dispatch({ type: 'SET_GEOCODED_ORIGIN', originObject, name: originObject.properties.name, error })
    const odFc = turf.asFeatureCollection(destObject ? [originObject, destObject] : [originObject])
    dispatch(zoomToFC(odFc))
  }
}

export const setOriginDuringRouting = (originObject: OdPlace) => {
  return async (dispatch: any) => {
    dispatch({ type: 'SET_GEOCODED_ORIGIN', originObject, name: originObject.properties.name, error: null })
  }
}

export const hideOriginOptions = () => {
  return { type: 'HIDE_ORIGIN_OPTIONS' }
}

export const resetOriginInput = () => {
  return { type: 'RESET_ORIGIN_INPUT' }
}

export const toggleOriginOptionsVisible = () => {
  return { type: 'TOGGLE_ORIGIN_OPTIONS' }
}

export const useUserLocationOrigin = (e: any, userLocation: UserLocationReducer, destObject: OdPlace | null) => {
  e.stopPropagation()
  return async (dispatch: any) => {
    dispatch({ type: 'RESET_ORIGIN_INPUT' })
    dispatch({ type: 'RESET_PATHS' })
    closePopup()
    const lngLat = userLocation.lngLat
    if (lngLat) {
      const originObject = getOriginFromCoords([lngLat.lng, lngLat.lat], LocationType.USER_LOCATION)
      const error = originWithinSupportedArea(originObject)
      dispatch({
        type: 'SET_ORIGIN_TO_USER_LOCATION',
        originObject,
        error
      })
      const odFc = turf.asFeatureCollection(destObject ? [originObject, destObject] : [originObject])
      dispatch(zoomToFC(odFc))
    } else {
      dispatch({ type: 'WAIT_FOR_USER_LOC_ORIGIN' })
      dispatch(startTrackingUserLocation())
    }
  }
}

export const setOriginFromMap = (lngLat: LngLat) => {
  return async (dispatch: any) => {
    const originObject = getOriginFromCoords([lngLat.lng, lngLat.lat], LocationType.MAP_LOCATION)
    const error = originWithinSupportedArea(originObject)
    dispatch({ type: 'RESET_PATHS' })
    dispatch({ type: 'SET_ORIGIN_FROM_MAP', originObject, error })
    closePopup()
  }
}

export const getOriginFromGeocodingResult = (place: GeocodingResult): OdPlace => {
  return {
    ...place,
    type: 'Feature',
    properties: {
      ...place.properties,
      locationType: LocationType.ADDRESS,
      odType: OdType.ORIGIN
    }
  }
}

const roundCoords = (coord: number) => {
  return Math.round(coord * 10000) / 10000
}

const getOriginFromCoords = (coordinates: [number, number], locType: LocationType): OdPlace => {
  const label = String(roundCoords(coordinates[0])) + ' ' + String(roundCoords(coordinates[1]))
  return {
    geometry: {
      type: 'Point',
      coordinates
    },
    properties: {
      label,
      name: label,
      locationType: locType,
      odType: OdType.ORIGIN
    },
    type: 'Feature'
  }
}

const originWithinSupportedArea = (origin: OdPlace): string | null => {
  if (!turf.within(origin, extentFeat)) {
    return 'notif.error.origin_outside_extent'
  }
  return null
}

export default originReducer
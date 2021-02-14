import { Action } from 'redux'
import { ChangeEvent } from 'react'
import { LocationType, OdType } from './originReducer'
import { closePopup } from './mapPopupReducer'
import { zoomToFC } from './mapReducer'
import { extentFeat, egDest } from './../constants'
import { turf } from './../utils/index'
import * as geocoding from './../services/geocoding'

const initialDest: DestinationReducer = {
  error: null,
  destInputText: process.env.NODE_ENV === 'development' ? egDest.properties.label : '',
  destObject: process.env.NODE_ENV === 'development' ? egDest as OdPlace : null,
  destOptions: [],
  destOptionsVisible: false,
}

interface DestinationAction extends Action {
  destInputText: string,
  destOptions: GeocodingResult[],
  destObject: OdPlace,
  name: string,
  error: string | null
}

const destinationReducer = (store: DestinationReducer = initialDest, action: DestinationAction): DestinationReducer => {

  switch (action.type) {

    case 'UPDATE_DESTINATION_INPUT_VALUE':
      return {
        ...store,
        destInputText: action.destInputText,
        destObject: null,
        error: null
      } // no need to set destination options visible yet (let's wait for geocoding results)

    case 'SET_DESTINATION_OPTIONS':
      return {
        ...store,
        destOptions: action.destOptions,
        destOptionsVisible: true
      }

    case 'HIDE_DESTINATION_OPTIONS':
      return { ...store, destOptionsVisible: false }

    case 'TOGGLE_DESTINATION_OPTIONS':
      return { ...store, destOptionsVisible: !store.destOptionsVisible }

    case 'SET_GEOCODED_DESTINATION':
      return {
        ...store,
        destObject: action.destObject,
        destInputText: action.name,
        destOptionsVisible: false,
        error: action.error
      }

    case 'SET_DESTINATION_FROM_MAP': {
      return {
        ...store,
        destObject: action.destObject,
        destInputText: action.destObject.properties.label,
        destOptionsVisible: false,
        error: action.error
      }
    }

    case 'RESET_DESTINATION_INPUT':
      return { ...initialDest, destObject: null, destInputText: '' }

    default:
      return store
  }
}

const showingCoordinates = (inputText: string): boolean => {
  const numberCount = inputText.replace(/[^0-9]/g, '').length
  return numberCount > Math.round(inputText.length / 2)
}

export const setDestinationInputText = (event: ChangeEvent<HTMLInputElement>) => {
  return async (dispatch: any) => {
    const destInputText = event.target ? event.target.value : ''
    dispatch({ type: 'UPDATE_DESTINATION_INPUT_VALUE', destInputText })
    if (destInputText.length > 2 && !showingCoordinates(destInputText)) {
      const destOptions = await geocoding.geocodeAddress(destInputText, 6)
      dispatch({ type: 'SET_DESTINATION_OPTIONS', destOptions })
    } else {
      dispatch({ type: 'HIDE_DESTINATION_OPTIONS' })
      dispatch({ type: 'SET_DESTINATION_OPTIONS', destOptions: [] })
    }
  }
}

export const setGeocodedDestination = (place: GeocodingResult, originObject: OdPlace | null) => {
  return async (dispatch: any) => {
    const destObject = getDestinationFromGeocodingResult(place)
    const error = destWithinSupportedArea(destObject)
    dispatch({ type: 'SET_GEOCODED_DESTINATION', destObject, error, name: place.properties.name })
    const odFc = turf.asFeatureCollection(originObject ? [originObject, destObject] : [destObject])
    dispatch(zoomToFC(odFc))
  }
}

export const setUsedDestination = (destObject: OdPlace, originObject: OdPlace | null) => {
  return async (dispatch: any) => {
    destObject.properties.odType = OdType.DESTINATION
    const error = destWithinSupportedArea(destObject)
    dispatch({ type: 'SET_GEOCODED_DESTINATION', destObject, error, name: destObject.properties.name })
    const odFc = turf.asFeatureCollection(originObject ? [originObject, destObject] : [destObject])
    dispatch(zoomToFC(odFc))
  }
}

export const setDestinationDuringRouting = (destObject: OdPlace) => {
  return async (dispatch: any) => {
    dispatch({ type: 'SET_GEOCODED_DESTINATION', destObject, name: destObject.properties.name, error: null })
  }
}

export const hideDestinationOptions = () => {
  return { type: 'HIDE_DESTINATION_OPTIONS' }
}

export const resetDestinationInput = () => {
  return { type: 'RESET_DESTINATION_INPUT' }
}

export const toggleDestinationOptionsVisible = () => {
  return { type: 'TOGGLE_DESTINATION_OPTIONS' }
}

export const setDestinationFromMap = (lngLat: LngLat) => {
  return async (dispatch: any) => {
    const destObject = getDestinationFromCoords([lngLat.lng, lngLat.lat], LocationType.MAP_LOCATION)
    const error = destWithinSupportedArea(destObject)
    dispatch({ type: 'RESET_PATHS' })
    dispatch({ type: 'SET_DESTINATION_FROM_MAP', destObject, error })
    closePopup()
  }
}

export const getDestinationFromGeocodingResult = (place: GeocodingResult): OdPlace => {
  return {
    ...place,
    type: 'Feature',
    properties: {
      ...place.properties,
      locationType: LocationType.ADDRESS,
      odType: OdType.DESTINATION
    }
  }
}

const roundCoords = (coord: number) => {
  return Math.round(coord * 10000) / 10000
}

const getDestinationFromCoords = (coordinates: [number, number], locType: LocationType): OdPlace => {
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
      odType: OdType.DESTINATION
    },
    type: 'Feature'
  }
}

const destWithinSupportedArea = (destination: OdPlace): string | null => {
  if (!turf.within(destination, extentFeat)) {
    return 'notif.error.destination_outside_extent'
  }
  return null
}

export default destinationReducer
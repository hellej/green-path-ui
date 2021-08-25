import MapboxGl from 'mapbox-gl'
import { Popup, Map } from 'mapbox-gl'
import { Action } from 'redux'
import { LngLat, MapPopupReducer } from '../types'

const initialMapPopups: MapPopupReducer = {
  visible: false,
  lngLat: {},
}

let mbPopup: Popup
let mapRef: Map

interface PopupAction extends Action {
  lngLat: LngLat
}

const mapPopupReducer = (
  store: MapPopupReducer = initialMapPopups,
  action: PopupAction,
): MapPopupReducer => {
  switch (action.type) {
    case 'SET_POPUP':
      return { ...store, visible: true }

    case 'SET_POPUP_LNGLAT':
      return { ...store, lngLat: action.lngLat }

    case 'CLOSE_POPUP':
      return initialMapPopups

    default:
      return store
  }
}

export const setSelectLocationsPopup = (lngLat: LngLat) => {
  return async (dispatch: any) => {
    if (mbPopup) {
      mbPopup.remove()
      dispatch({ type: 'CLOSE_POPUP' })
    }
    dispatch({ type: 'SET_POPUP_LNGLAT', lngLat })

    mbPopup = new MapboxGl.Popup({ closeOnClick: true, closeButton: true, anchor: 'bottom' })

    // React uses id for rendering popup content
    mbPopup.setLngLat(lngLat).setHTML('<div data-cy="popup" id="popup" </div>').addTo(mapRef)

    // prevent initial focus of close button
    const closeEl = document.getElementsByClassName(
      'mapboxgl-popup-close-button',
    ) as HTMLCollectionOf<HTMLElement>
    if (closeEl.length === 1) {
      closeEl[0].blur()
    }

    dispatch({ type: 'SET_POPUP' })
  }
}

export const closePopup = () => {
  if (mbPopup) mbPopup.remove()
}

export const setMapReferenceForPopups = (map: Map) => {
  if (!mapRef) mapRef = map
}

export default mapPopupReducer

import { Action } from 'redux'
import { showNotification } from './notificationReducer'

const initialAirQualityLayer: AirQualityLayerReducer = {
  hasData: false,
  loadingData: false,
  dataTimeUtcSecs: undefined,
  styleUpdateDelays: 0,
  waitingStyleUpdate: false,
  updatingStyle: false,
}

interface AqAction extends Action {
  loadingData: boolean
  waitingStyleUpdate: boolean
  updatingStyle: boolean
  dataTimeUtcSecs: number
}

const airQualityLayerReducer = (
  store: AirQualityLayerReducer = initialAirQualityLayer,
  action: AqAction,
): AirQualityLayerReducer => {
  switch (action.type) {

    case 'SET_LOADING_DATA':
      return { ...store, loadingData: action.loadingData }

    case 'AQI_MAP_DATA_NOT_AVAILABLE':
      return initialAirQualityLayer

    case 'SET_DATA_LOADED':
      return { ...store, hasData: true, dataTimeUtcSecs: action.dataTimeUtcSecs }

    case 'SET_WAITING':
      return { ...store, waitingStyleUpdate: action.waitingStyleUpdate }

    case 'SET_UPDATING_STYLE':
      return { ...store, updatingStyle: action.updatingStyle }

    case 'SET_STYLE_UPDATE_DELAY':
      return { ...store, styleUpdateDelays: store.styleUpdateDelays + 1, waitingStyleUpdate: true }

    case 'FINISH_STYLE_UPDATE_DELAY': {
      const styleUpdateDelays = store.styleUpdateDelays < 1 ? 0 : store.styleUpdateDelays - 1
      return { ...store, styleUpdateDelays }
    }

    default:
      return store
  }
}

export const setLoadingData = (loadingData: boolean) => ({ type: 'SET_LOADING_DATA', loadingData })

export const setDataLoaded = (dataTimeUtcSecs: number) => {
  return { type: 'SET_DATA_LOADED', dataTimeUtcSecs }
}

export const setWaitingStyleUpdate = (waitingStyleUpdate: boolean) => ({
  type: 'SET_WAITING',
  waitingStyleUpdate,
})

export const setUpdatingStyle = (updatingStyle: boolean) => ({
  type: 'SET_UPDATING_STYLE',
  updatingStyle,
})

export const setDelayedStyleUpdate = (time: number) => {
  return (dispatch: any) => {
    dispatch({ type: 'SET_STYLE_UPDATE_DELAY' })
    setTimeout(() => dispatch({ type: 'FINISH_STYLE_UPDATE_DELAY' }), time)
  }
}

export const handleDataNotAvailable = () => {
  return (dispatch: any) => {
    dispatch({ type: 'AQI_MAP_DATA_NOT_AVAILABLE' })
    dispatch(showNotification('notif.error.no_aqi_map_data_available', 'error', 8))
  }
}

export default airQualityLayerReducer

import { Action } from 'redux'

const initialAirQualityLayer: AirQualityLayerReducer = {
  hasData: false,
  loadingData: false,
  styleUpdateDelays: 0,
  waitingStyleUpdate: false,
  updatingStyle: false,
}

interface AqAction extends Action {
  loadingData: boolean
  waitingStyleUpdate: boolean
  updatingStyle: boolean
}

const airQualityLayerReducer = (
  store: AirQualityLayerReducer = initialAirQualityLayer,
  action: AqAction,
): AirQualityLayerReducer => {
  switch (action.type) {
    case 'RESET_AIR_QUALITY_LAYER':
      return { ...initialAirQualityLayer, hasData: store.hasData, loadingData: store.loadingData }

    case 'SET_LOADING_DATA':
      return { ...store, loadingData: action.loadingData }

    case 'SET_DATA_LOADED':
      return { ...store, hasData: true }

    case 'SET_WAITING':
      return { ...store, waitingStyleUpdate: action.waitingStyleUpdate }

    case 'SET_UPDATING_STYLE':
      return { ...store, updatingStyle: action.updatingStyle }

    case 'SET_STYLE_UPDATE_DELAY':
      return { ...store, styleUpdateDelays: store.styleUpdateDelays + 1 }

    case 'FINISH_STYLE_UPDATE_DELAY': {
      const styleUpdateDelays = store.styleUpdateDelays <= 0 ? 0 : store.styleUpdateDelays - 1
      return { ...store, styleUpdateDelays }
    }

    default:
      return store
  }
}

export const resetAirQualityLayer = () => ({ type: 'RESET_AIR_QUALITY_LAYER' })

export const setLoadingData = (loadingData: boolean) => ({ type: 'SET_LOADING_DATA', loadingData })

export const setDataLoaded = () => ({ type: 'SET_DATA_LOADED' })

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

export default airQualityLayerReducer

import { Action } from 'redux'

const initialAirQualityLayer: AirQualityLayerReducer = {
  hasData: false,
  waiting: false,
  loading: false,
  waitingLoadsCount: 0,
}

interface AqAction extends Action {
  waiting: boolean
  loading: boolean
}

const airQualityLayerReducer = (
  store: AirQualityLayerReducer = initialAirQualityLayer,
  action: AqAction,
): AirQualityLayerReducer => {
  switch (action.type) {
    case 'RESET_AIR_QUALITY_LAYER':
      return { ...initialAirQualityLayer, hasData: store.hasData }

    case 'SET_DATA_LOADED':
      return { ...store, hasData: true }

    case 'SET_WAITING':
      return { ...store, waiting: action.waiting }

    case 'SET_LOADING':
      return { ...store, waiting: action.loading }

    case 'SET_STYLE_UPDATE_DELAY':
      return { ...store, waitingLoadsCount: store.waitingLoadsCount + 1 }

    case 'FINISH_STYLE_UPDATE_DELAY':
      return { ...store, waitingLoadsCount: store.waitingLoadsCount - 1 }

    default:
      return store
  }
}

export const setDataLoaded = () => ({ type: 'SET_DATA_LOADED' })

export const resetAirQualityLayer = () => ({ type: 'RESET_AIR_QUALITY_LAYER' })

export const setWaiting = (waiting: boolean) => ({ type: 'SET_WAITING', waiting })

export const setLoading = (loading: boolean) => ({ type: 'SET_LOADING', loading })

export const setDelayedStyleUpdate = (time: number) => {
  return (dispatch: any) => {
    dispatch({ type: 'SET_STYLE_UPDATE_DELAY' })
    setTimeout(() => dispatch({ type: 'FINISH_STYLE_UPDATE_DELAY' }), time)
  }
}

export default airQualityLayerReducer

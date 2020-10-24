import axios from 'axios'
import { analytics } from './../firebase/firebase'

let baseurl = process.env.REACT_APP_QP_URL ? process.env.REACT_APP_QP_URL : ''

if (process.env.NODE_ENV !== 'production') {
  baseurl = 'http://localhost:5000/'
}

export interface AqiMapDataStatus {
  aqi_map_data_available: boolean
  aqi_map_data_utc_time_secs: number | null
}

export const getAqiMapDataStatus = async (): Promise<AqiMapDataStatus> => {
  try {
    const response = await axios.get(baseurl.concat('aqi-map-data-status'))
    if (response.data) {
      return response.data as AqiMapDataStatus
    }
  } catch (error) {
    console.error('could not fetch AQI map data status')
  }
  return { aqi_map_data_available: false, aqi_map_data_utc_time_secs: null}
}

export const getAqiLayerData = async (): Promise<Map<number, number> | undefined> => {
    const response = await axios.get(baseurl.concat('aqi-map-data'))
    if (response.data) {
      analytics.logEvent('aqi_map_data_loaded')
      return new Map(response.data.data as [number, number][])
    } else {
      analytics.logEvent('aqi_map_data_unavailable')
      console.error('no AQI map data available')
    }
}

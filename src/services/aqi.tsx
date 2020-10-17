import axios from 'axios'
import { analytics } from './../firebase/firebase'

let baseurl = process.env.REACT_APP_QP_URL ? process.env.REACT_APP_QP_URL : ''

if (process.env.NODE_ENV !== 'production') {
  baseurl = 'http://localhost:5000/'
}

export const getAqiLayerData = async (): Promise<Map<number, number> | undefined> => {
  const response = await axios.get(baseurl.concat('aqi-map-data'))
  if (response.data) {
    return new Map(response.data.data as [number, number][])
    analytics.logEvent('aqi_map_data_loaded')
  } else {
    console.error('No AQI map data available')
  }
}

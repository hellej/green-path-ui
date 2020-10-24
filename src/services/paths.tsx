import axios from 'axios'
import { analytics } from './../firebase/firebase'
import { ExposureMode } from '../constants'
import * as cache from './cache'

let baseurl = process.env.REACT_APP_QP_URL ? process.env.REACT_APP_QP_URL : ''

if (process.env.NODE_ENV !== 'production') {
  baseurl = 'http://localhost:5000/'
}

export interface AqiStatus {
  aqi_data_updated: boolean
  aqi_data_utc_time_secs: number | null
}

export const getConnectionTestResponse = async (): Promise<string | any> => {
  console.log('testing connection to gp service at:', baseurl)
  const response = await axios.get(baseurl)
  return response
}

export const getCleanPathServiceStatus = async (): Promise<AqiStatus> => {
  const response = await axios.get(baseurl.concat('aqistatus'))
  return response.data as AqiStatus
}

const formCoordinateString = (originCoords: number[], destinationCoords: number[]): string => {
  const fromC = originCoords.map(coord => String(coord))
  const toC = destinationCoords.map(coord => String(coord))
  return fromC[1].concat(',', fromC[0], '/', toC[1], ',', toC[0])
}

export const getQuietPaths = async (travelMode: TravelMode, originCoords: number[], destinationCoords: number[]): Promise<PathDataResponse> => {
  const coordString = formCoordinateString(originCoords, destinationCoords)
  const queryUrl = baseurl.concat('paths/', travelMode, '/', ExposureMode.QUIET, '/', coordString)
  const cached = cache.getFromCache(queryUrl)
  if (cached) {
    console.log('Found quiet paths from cache:', queryUrl)
    return cached
  } else {
    console.log('Querying quiet paths from server:', queryUrl)
    const response = await axios.get(queryUrl)
    if (response.data.error_key) {
      analytics.logEvent('routing_error_quiet_paths')
      throw response.data.error_key
    }
    analytics.logEvent('routed_quiet_paths')
    cache.setToCacheWithExpiry(queryUrl, response.data, 3600)
    return response.data
  }
}

export const getCleanPaths = async (travelMode: TravelMode, originCoords: number[], destinationCoords: number[]): Promise<PathDataResponse> => {
  const coordString = formCoordinateString(originCoords, destinationCoords)
  const queryUrl = baseurl.concat('paths/', travelMode, '/', ExposureMode.CLEAN, '/', coordString)
  const cached = cache.getFromCache(queryUrl)
  if (cached) {
    console.log('Found clean paths from cache:', queryUrl)
    return cached
  } else {
    console.log('Querying clean paths from server:', queryUrl)
    const response = await axios.get(queryUrl)
    if (response.data.error_key) {
      analytics.logEvent('routing_error_clean_paths')
      throw response.data.error_key
    }
    analytics.logEvent('routed_clean_paths')
    cache.setToCacheWithExpiry(queryUrl, response.data, 900)
    return response.data
  }
}

export const debugNearestEdgeAttrs = async (lngLat: LngLat): Promise<void> => {
  const coordString = String(lngLat.lat).concat(',', String(lngLat.lng))
  const queryUrl = baseurl.concat('edge-attrs-near-point/', coordString)
  const response = await axios.get(queryUrl)
  console.log('nearest edge at', lngLat, response.data)
}

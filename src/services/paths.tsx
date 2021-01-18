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
  aqi_data_utc_time_secs: number | null
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
  const fromC = originCoords.map((coord) => String(coord))
  const toC = destinationCoords.map((coord) => String(coord))
  return fromC[1].concat(',', fromC[0], '/', toC[1], ',', toC[0])
}

export const getQuietPaths = async (
  travelMode: TravelMode,
  originCoords: number[],
  destinationCoords: number[],
): Promise<PathData> => {
  const coordString = formCoordinateString(originCoords, destinationCoords)
  const queryUrl = baseurl.concat('paths/', travelMode, '/', ExposureMode.QUIET, '/', coordString)
  const cached = cache.getFromCache(queryUrl)
  if (cached) {
    console.log('Found quiet paths from cache:', queryUrl)
    return processPathData(cached)
  } else {
    console.log('Querying quiet paths from server:', queryUrl)
    const response = await axios.get(queryUrl)
    if (response.data.error_key) {
      analytics.logEvent('routing_error_quiet_paths')
      throw response.data.error_key
    }
    analytics.logEvent('routed_quiet_paths')
    cache.setToCacheWithExpiry(queryUrl, response.data, 3600)
    return processPathData(response.data)
  }
}

export const getCleanPaths = async (
  travelMode: TravelMode,
  originCoords: number[],
  destinationCoords: number[],
): Promise<PathData> => {
  const coordString = formCoordinateString(originCoords, destinationCoords)
  const queryUrl = baseurl.concat('paths/', travelMode, '/', ExposureMode.CLEAN, '/', coordString)
  const cached = cache.getFromCache(queryUrl)
  if (cached) {
    console.log('Found clean paths from cache:', queryUrl)
    return processPathData(cached)
  } else {
    console.log('Querying clean paths from server:', queryUrl)
    const response = await axios.get(queryUrl)
    if (response.data.error_key) {
      analytics.logEvent('routing_error_clean_paths')
      throw response.data.error_key
    }
    analytics.logEvent('routed_clean_paths')
    cache.setToCacheWithExpiry(queryUrl, response.data, 900)
    return processPathData(response.data)
  }
}

export const debugNearestEdgeAttrs = async (lngLat: LngLat): Promise<void> => {
  const coordString = String(lngLat.lat).concat(',', String(lngLat.lng))
  const queryUrl = baseurl.concat('edge-attrs-near-point/', coordString)
  const response = await axios.get(queryUrl)
  console.log('nearest edge at', lngLat, response.data)
}

const cleanExposureScore = (score: number | null): number | null => {
  if (!score) return null
  if (score > 100.0) {
    return 100
  }
  return +score.toFixed(1)
}

const processPathProps = (props: RawPathProperties): PathProperties => {
  const aqScore = !props.missing_aqi ? (1 - props.aqc_norm) * 100 : null
  const noisiness = !props.missing_gvi ? props.nei_norm * 100 : null
  const quietness = noisiness ? 100 - noisiness : null
  const greenery = !props.missing_gvi ? props.gvi_m * 100 : null
  return {
    ...props,
    aqScore: cleanExposureScore(aqScore),
    quietnessScore: cleanExposureScore(quietness),
    noisinessScore: cleanExposureScore(noisiness),
    greeneryScore: cleanExposureScore(greenery),
  }
}

const processPathData = (pathData: PathDataResponse): PathData => {
  const path_FC = {
    ...pathData.path_FC,
    features: pathData.path_FC.features.map((f) => {
      return {
        ...f,
        properties: processPathProps(f.properties),
      }
    }),
  }

  return {
    edge_FC: pathData.edge_FC,
    path_FC,
  }
}

import axios from 'axios'
import { analytics } from './../firebase/firebase'
import * as cache from './cache'
import { LngLat, PathData, RawPathProperties, PathProperties, PathDataResponse } from '../types'

const serverUrl = process.env.REACT_APP_GP_SERVER || 'http://localhost:5000/'

export enum ExposureMode { // i.e. RoutingMode
  QUIET = 'quiet',
  GREEN = 'green',
  CLEAN = 'clean',
  FAST = 'fast',
  SAFE = 'safe',
}

export enum TravelMode {
  WALK = 'walk',
  BIKE = 'bike',
}

export interface AqiStatus {
  aqi_data_updated: boolean
  aqi_data_utc_time_secs: number | null
}

export const getConnectionTestResponse = async (): Promise<string | any> => {
  console.log('testing connection to gp service at:', serverUrl)
  const response = await axios.get(serverUrl)
  return response
}

export const getCleanPathServiceStatus = async (): Promise<AqiStatus> => {
  const response = await axios.get(serverUrl.concat('aqistatus'))
  return response.data as AqiStatus
}

const formCoordinateString = (oCoords: number[], dCoords: number[]): string => {
  return `${oCoords[1]},${oCoords[0]}/${dCoords[1]},${dCoords[0]}`
}

export const getPaths = async (
  originCoords: number[],
  destinationCoords: number[],
  travelMode: TravelMode,
  exposureMode: ExposureMode,
): Promise<PathData> => {
  const coordString = formCoordinateString(originCoords, destinationCoords)
  const queryUrl = `${serverUrl}/paths/${travelMode}/${exposureMode}/${coordString}`
  const cached = cache.getFromCache(queryUrl)
  if (cached) {
    console.log('Found paths from cache:', queryUrl)
    return processPathData(cached)
  }
  console.log('Requesting paths from server:', queryUrl)
  const response = await fetch(queryUrl)
  const data = await response.json()
  if (response.status >= 400 || data.error_key) {
    analytics.logEvent(`routing_error_${exposureMode}_${travelMode}_paths`)
    throw data.error_key ? data.error_key : 'notif.error.routing.general_routing_error'
  }
  analytics.logEvent(`routed_${exposureMode}_${travelMode}_paths`)
  const cacheTtlSecs = exposureMode === ExposureMode.CLEAN ? 300 : 3600
  cache.setToCacheWithExpiry(queryUrl, data, cacheTtlSecs)
  return processPathData(data)
}

export const debugNearestEdgeAttrs = async (lngLat: LngLat): Promise<void> => {
  const coordString = String(lngLat.lat).concat(',', String(lngLat.lng))
  const queryUrl = serverUrl.concat('edge-attrs-near-point/', coordString)
  const response = await axios.get(queryUrl)
  console.log('nearest edge at', lngLat, response.data)
}

const adjustExposureScore = (score: number | null): number | null => {
  if (score === null) return null
  if (score > 100.0) return 100
  if (score <= 2) {
    return 2 // this we can still visually see in the exposure chart
  }
  return +score.toFixed(1)
}

const stretchScoreFromRange = (value: number, rangeMin: number, rangeMax: number): number => {
  if (value <= rangeMin) return 0
  if (value >= rangeMax) return 100
  const score = (100 * (value - rangeMin)) / (rangeMax - rangeMin)
  return +score.toFixed(1)
}

const processPathProps = (props: RawPathProperties): PathProperties => {
  const aqScore = !props.missing_aqi ? (1 - props.aqc_norm) * 100 : null
  const noisiness = !props.missing_gvi ? stretchScoreFromRange(props.nei_norm, 0.05, 0.56) : null
  const quietness = noisiness !== null ? 100 - noisiness : null
  const greenery = !props.missing_gvi ? stretchScoreFromRange(props.gvi_m, 0.08, 0.6) : null
  return {
    ...props,
    aqScore: adjustExposureScore(aqScore),
    noisinessScore: adjustExposureScore(noisiness),
    quietnessScore: adjustExposureScore(quietness),
    greeneryScore: adjustExposureScore(greenery),
  }
}

const processPathData = (pathData: PathDataResponse): PathData => {
  const path_FC = {
    ...pathData.path_FC,
    features: pathData.path_FC.features.map(f => {
      return {
        ...f,
        properties: processPathProps(f.properties),
      }
    }),
  }

  return {
    ...pathData,
    path_FC,
  }
}

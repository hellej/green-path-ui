import { speedByTravelMode } from './../constants'
import { MapMouseEvent, Map, PointLike } from 'mapbox-gl'
import { LengthLimit, PathFeature } from '../types'
import { ExposureMode, TravelMode } from '../services/paths'

const concatSign = (number: number): string => {
  if (number < 0) {
    return '-' + String(number)
  } else if (number > 0) {
    return '+' + String(number)
  } else return String(number)
}

export const getSecsFromLength = (m: number, travelMode: TravelMode) => {
  const speed = speedByTravelMode[travelMode]
  return m / speed
}

export const getSecsFromModeLengths = (modeLengths: { walk: number; bike: number }) => {
  let timeSecs = 0
  if (modeLengths.walk > 0) {
    timeSecs += modeLengths.walk / speedByTravelMode[TravelMode.WALK]
  }
  if (modeLengths.bike > 0) {
    timeSecs += modeLengths.bike / speedByTravelMode[TravelMode.BIKE]
  }
  return timeSecs
}

export const formatDuration = (
  timeSecs: number,
  showSeconds: boolean = false,
  withSign: boolean = false,
): string => {
  const roundedSecs = Math.round(timeSecs)
  const timeMin = timeSecs / 60
  const roundedMins = Math.round(timeMin)
  let formattedDuration = ''
  let unit = 'min'
  if (roundedMins === 0) {
    if (showSeconds === true) {
      unit = 's'
      formattedDuration = withSign === true ? concatSign(roundedSecs) : String(roundedSecs)
    } else return ''
  } else {
    formattedDuration = withSign === true ? concatSign(roundedMins) : String(roundedMins)
  }
  return formattedDuration + ' ' + unit
}

export const getLayersFeaturesAroundClickE = (
  layers: string[] | undefined,
  e: MapMouseEvent,
  tolerance: number,
  map: Map,
) => {
  // tolerance: pixels around point
  const bbox: [PointLike, PointLike] = [
    [e.point.x - tolerance, e.point.y - tolerance],
    [e.point.x + tolerance, e.point.y + tolerance],
  ]
  const features = map.queryRenderedFeatures(bbox, { layers })
  return features
}

const getLengthLimit = (length: number, rounding: number) => Math.ceil(length / rounding) * rounding

export const getLengthLimits = (greenPathFeatures: PathFeature[]): LengthLimit[] => {
  const pathLengths = greenPathFeatures.map(feat => feat.properties.length)
  const pathProps = greenPathFeatures
    .map(feat => feat.properties)
    .sort((a, b) => a.length - b.length)
  return pathProps.reduce((acc: LengthLimit[], props) => {
    const length = props.length
    // get limit as rounded value higher than the actual length
    const limit = length > 1000 ? getLengthLimit(length, 100) : getLengthLimit(length, 50)
    // add new limit if it's not in the limits list yet
    if (acc.map(limit => limit.limit).indexOf(limit) === -1) {
      // create label for len diff to be shown in options input
      const pathCount = pathLengths.filter(x => x < limit).length
      const limitText = limit < 1000 ? String(limit) + ' m' : String(limit / 1000) + ' km'
      const label = limitText + ' (' + String(pathCount) + ')'
      acc.push({ limit, count: pathCount, label, cost_coeff: props.cost_coeff })
    }
    return acc
  }, [])
}

export const getInitialLengthLimit = (
  lengthLimits: LengthLimit[],
  exposureMode: ExposureMode,
  pathCount: number,
  costCoeffLimit = 20,
): LengthLimit => {
  if (exposureMode === ExposureMode.CLEAN) {
    // disable initial length limit for fresh air paths
    return lengthLimits[lengthLimits.length - 1]
  }
  // return length limit that filters out paths with cost_coeff higher than 20
  if (lengthLimits.length > 1 && pathCount > 3) {
    let prevDl = lengthLimits[0]
    for (let dL of lengthLimits) {
      if (dL.cost_coeff >= costCoeffLimit) return prevDl
      prevDl = dL
    }
  }
  return lengthLimits[lengthLimits.length - 1]
}

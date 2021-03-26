import { walkSpeed, bikeSpeed } from './../constants'
import { MapMouseEvent, Map, PointLike } from 'mapbox-gl'
import { LengthLimit, PathFeature } from '../types'
import { TravelMode } from '../services/paths'

const concatSign = (number: number): string => {
  if (number < 0) {
    return '-' + String(number)
  } else if (number > 0) {
    return '+' + String(number)
  } else return String(number)
}

export const getDurationStringFromDist = (
  m: number,
  travelMode: TravelMode,
  showSeconds: boolean = false,
  withSign: boolean = false,
): string => {
  const speed = travelMode === TravelMode.WALK ? walkSpeed : bikeSpeed
  const timeSecs = m / speed
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

export const getBestPath = (greenPathFeatures: PathFeature[]): PathFeature | null => {
  if (greenPathFeatures.length > 0) {
    const goodPaths = greenPathFeatures.filter(
      feat => feat.properties.path_score > 0.8 && feat.properties.cost_coeff <= 5,
    )
    if (goodPaths.length > 0) {
      const maxPathScore = Math.max(...goodPaths.map(path => path.properties.path_score))
      const bestPath = goodPaths.filter(feat => feat.properties.path_score === maxPathScore)[0]
      return bestPath
    }
  }
  return null
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
  pathCount: number,
  costCoeffLimit: number,
): LengthLimit => {
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

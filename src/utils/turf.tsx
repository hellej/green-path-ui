import bbox from '@turf/bbox'
import buffer from '@turf/buffer'
// @ts-ignore
import distance from '@turf/distance'
// @ts-ignore
import booleanWithin from '@turf/boolean-within'
import { Feature } from '@turf/helpers'
import { point } from '@turf/helpers'
import {
  EdgeFeature,
  EdgeFeatureCollection,
  FeatureCollection,
  OdFeatureCollection,
  OdPlace,
  PathFeature,
  PathFeatureCollection,
  PointFeature,
  PointFeatureCollection,
} from '../types'

export const asPoint = (coords: [number, number], properties?: {}): PointFeature => {
  return point(coords, { type: '', ...properties })
}

type FeatureCollectionReturnTypes = {
  (features: PathFeature[]): PathFeatureCollection
  (features: EdgeFeature): EdgeFeatureCollection
  (features: PointFeature[]): PointFeatureCollection
  (features: OdPlace[]): OdFeatureCollection
}

export const asFeatureCollection: FeatureCollectionReturnTypes = (features: any) => {
  return { type: 'FeatureCollection' as any, features }
}

export const getBuffer = (geojsonFeature: FeatureCollection, dist: number) => {
  return buffer(geojsonFeature, dist, { units: 'meters' })
}

export const getBbox = (geojsonFeature: any): [number, number, number, number] => {
  // @ts-ignore
  return bbox(geojsonFeature)
}

export const within = (feat: Feature, feat2: Feature) => {
  return booleanWithin(feat, feat2)
}

export const getDistance = (originCoords: [number, number], destCoords: [number, number]) => {
  const dist = distance(asPoint(originCoords), asPoint(destCoords), { units: 'meters' })
  return Math.round(dist)
}

export const toLngLat = (coords: number[]) => {
  return { lng: coords[0], lat: coords[1] }
}

export const getLngLatFromFC = (FC: PointFeatureCollection) => {
  const feat = FC.features[0]
  if (feat) {
    return toLngLat(feat.geometry.coordinates)
  } else return null
}

import hmaPoly from './HMA.json'
import { ExposureMode, TravelMode } from './services/paths'
import { AqiClass, GviClass, PolygonFeature } from './types'

export const extentFeat = hmaPoly.features[0] as PolygonFeature

export enum UrlStateKey {
  BASEMAP = 'map',
  OD_PANEL_VISIBLE = 'od',
}

export enum Basemap {
  STREETS = 'mapbox://styles/joose/cjvbyzwuk31oe1fohk6s9ev4b',
  NOISE = 'mapbox://styles/joose/ckenvi8t83bbc19qqq3io2zvu',
  GVI = 'mapbox://styles/joose/ckkvdtsne3v3717pgtvw5gx0w',
  AIR_QUALITY = 'mapbox://styles/joose/ckg3ie4ln1pqp19rzjfpjf5c1',
  SATELLITE = 'mapbox://styles/joose/ckf9du1ua28cj19mk96oidub3',
}

export const defaultBasemap = Basemap.STREETS

export const UrlIdByBasemap: Record<Basemap, string> = {
  [Basemap.STREETS]: 'streets',
  [Basemap.NOISE]: 'noise',
  [Basemap.AIR_QUALITY]: 'airquality',
  [Basemap.GVI]: 'gvi',
  [Basemap.SATELLITE]: 'satellite',
}

export const BasemapByUrlId = new Map([
  ['streets', Basemap.STREETS],
  ['noise', Basemap.NOISE],
  ['airquality', Basemap.AIR_QUALITY],
  ['gvi', Basemap.GVI],
  ['satellite', Basemap.SATELLITE],
])

export enum LayerId {
  USER_LOC = 'userLoc',
  ORIG_DEST = 'origDest',
  SHORT_PATH = 'pathShort',
  GREEN_PATHS = 'pathsGreen',
  SELECTED_PATH = 'pathSelected',
  PATHS_EDGES = 'pathsEdges',
  BASEMAP = 'baseMapLayer',
  AQI_LAYER = 'aqistreetshma',
}

export type DbClass = 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75

export const dBColors: Record<DbClass, string> = {
  40: '#00f000',
  45: '#00f000',
  50: '#74f000',
  55: '#c4f31c',
  60: '#f7cc0e',
  65: '#ff6913',
  70: '#FF270E',
  75: '#FF270E',
}

export const labelByAqiClass: Record<AqiClass, string> = {
  1: 'air_quality_label.good_1',
  2: 'air_quality_label.good_2',
  3: 'air_quality_label.satisfactory_3',
  4: 'air_quality_label.satisfactory_4',
  5: 'air_quality_label.fair_5',
  6: 'air_quality_label.fair_6',
  7: 'air_quality_label.poor_7',
  8: 'air_quality_label.poor_8',
  9: 'air_quality_label.very_poor',
}

export const colorByAqiClass: Record<AqiClass, string> = {
  1: '#31A354',
  2: '#A1D99B',
  3: '#e9cfb8',
  4: '#FDD0A2',
  5: '#FDAE6B',
  6: '#FD8D3C',
  7: '#E6550D',
  8: '#A63603',
  9: '#A63603',
}

export const aqiMapColorByAqiClass: Record<AqiClass, string> = {
  1: '#038a37',
  2: '#459255',
  3: '#b4a75c',
  4: '#e6954e',
  5: '#ff8935',
  6: '#ff6b20',
  7: '#ff4c15',
  8: '#ff2f20',
  9: '#ff2f20',
}

export const colorByGviClass: Record<GviClass, string> = {
  0: '#b0b0b0',
  1: '#b0b0b0',
  2: '#a3b89c',
  3: '#94be87',
  4: '#83c571',
  5: '#6eca5a',
  6: '#52d03e',
  7: '#1dd513',
  8: '#1dd513',
  9: '#1dd513',
  10: '#1dd513',
}

export const gviMapColorByGviClass: Record<GviClass, string> = {
  0: '#606060',
  1: '#606060',
  2: '#616e5b',
  3: '#607d56',
  4: '#5d8b51',
  5: '#599a4a',
  6: '#53a842',
  7: '#49b738',
  8: '#3ac62a',
  9: '#1dd513',
  10: '#1dd513',
}

export const menu = {
  lengthLimitSelector: 'length_limit_selector',
  pathList: 'path_list',
}

const walkSpeed = 1.25

const bikeSpeed = 4.3

export const speedByTravelMode: Record<TravelMode, number> = {
  [TravelMode.WALK]: walkSpeed,
  [TravelMode.BIKE]: bikeSpeed,
}

export const clickTol = 12

export const noPathsErrorByExposureMode: Record<ExposureMode, string> = {
  [ExposureMode.QUIET]: 'notif.warn.no_alternative_quiet_paths_found',
  [ExposureMode.GREEN]: 'notif.warn.no_alternative_green_paths_found',
  [ExposureMode.CLEAN]: 'notif.warn.no_alternative_clean_paths_found',
  [ExposureMode.FAST]: 'notif.error.no_shortest_path_found',
  [ExposureMode.SAFE]: 'notif.error.no_safest_path_found',
}

export const initialMapCenter =
  process.env.REACT_APP_DEV_MAP_VIEW === 'True'
    ? { lng: 24.9664, lat: 60.211 }
    : { lng: 24.93535, lat: 60.24393 }

export const initialMapZoom = process.env.REACT_APP_DEV_MAP_VIEW === 'True' ? 13 : 10.03

export const egOrigin = {
  type: 'Feature',
  properties: {
    label: '24.969963 60.21743',
    locationType: 'map',
    odType: 'orig',
  },
  geometry: {
    type: 'Point',
    coordinates: [24.969963133335114, 60.21743118046364],
  },
}

export const egDest = {
  type: 'Feature',
  properties: {
    label: '24.9628257 60.2052225',
    locationType: 'map',
    odType: 'dest',
  },
  geometry: {
    type: 'Point',
    coordinates: [24.96282577514648, 60.20522256018594],
  },
}

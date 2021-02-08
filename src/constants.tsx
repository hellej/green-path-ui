import hmaPoly from './HMA.json'

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

export const UrlIdByBasemap = {
  [Basemap.STREETS]: 'streets',
  [Basemap.NOISE]: 'noise',
  [Basemap.AIR_QUALITY]: 'airquality',
  [Basemap.SATELLITE]: 'satellite',
} as Record<Basemap, string>

export const BasemapByUrlId = new Map([
  ['streets', Basemap.STREETS],
  ['noise', Basemap.NOISE],
  ['airquality', Basemap.AIR_QUALITY],
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

export enum TravelMode {
  WALK = 'walk',
  BIKE = 'bike',
}

export enum ExposureMode {
  CLEAN = 'clean',
  QUIET = 'quiet',
}

export enum PathType {
  SHORT = 'short',
  CLEAN = 'clean',
  QUIET = 'quiet',
}

export enum StatsType {
  AQ = 'air quality',
  NOISE = 'noise',
}

export type DbClass = 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75

export const dBColors = {
  40: '#00f000',
  45: '#00f000',
  50: '#74f000',
  55: '#c4f31c',
  60: '#f7cc0e',
  65: '#ff6913',
  70: '#FF270E',
  75: '#FF270E',
} as Record<DbClass, string>

export const labelByAqiClass = {
  2: 'air_quality_label.very_good',
  3: 'air_quality_label.good',
  4: 'air_quality_label.satisfactory',
  5: 'air_quality_label.rather_satisfactory',
  6: 'air_quality_label.fair',
  7: 'air_quality_label.poor',
  8: 'air_quality_label.very_poor',
  9: 'air_quality_label.extremely_poor',
  10: 'air_quality_label.extremely_poor',
} as Record<AqiClass, string>

export const colorByAqiClass = {
  2: '#31A354',
  3: '#A1D99B',
  4: '#e9cfb8',
  5: '#FDD0A2',
  6: '#FDAE6B',
  7: '#FD8D3C',
  8: '#E6550D',
  9: '#A63603',
  10: '#A63603',
} as Record<AqiClass, string>

export const aqiMapColorByAqiClass = {
  2: '#038a37',
  3: '#459255',
  4: '#b4a75c',
  5: '#e6954e',
  6: '#ff8935',
  7: '#ff6b20',
  8: '#ff4c15',
  9: '#ff2f20',
  10: '#ff2f20',
} as Record<AqiClass, string>

export const gviMapColorByGviClass = {
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
} as Record<GviClass, string>

export const menu = {
  lengthLimitSelector: 'length_limit_selector',
  pathList: 'path_list',
}

export const walkSpeed = 1.33

export const bikeSpeed = 4.15

export const clickTol = 12

export const initialMapCenter = { lng: 24.9664, lat: 60.211 }

export const initialMapCenterProd = { lng: 24.937886, lat: 60.180808 }

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

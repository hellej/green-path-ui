import { Feature, Geometry, Point, Polygon } from '@turf/helpers'
import { Map } from 'mapbox-gl'
import { Basemap, LayerId, PathType, StatsType } from './constants'
import { LocationType, OdType } from './reducers/originReducer'
import { Lang } from './reducers/uiReducer'
import { CarTripInfo } from './services/carTrips'
import { ExposureMode, TravelMode } from './services/paths'

export interface LngLat {
  lng: number
  lat: number
}

export interface FeatureCollection {
  type: 'FeatureCollection'
  features: Feature[]
}

export type MbMap = Map | null

export interface PointFeature extends Feature {
  geometry: Point
  properties: { type: string }
}

export interface PointFeatureCollection extends FeatureCollection {
  features: PointFeature[]
}

export interface OdFeatureCollection extends FeatureCollection {
  features: OdPlace[]
}

export interface PolygonFeature extends Feature {
  geometry: Polygon
}

export interface LengthLimit {
  limit: number
  count: number
  label: string
  cost_coeff: number
}

export type Coords = [number, number]

export type OdCoords = [Coords, Coords]

export type DbClass = 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75

export type GviClass = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type AqiClass = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface RawPathProperties {
  aqc: number
  aqc_diff: number
  aqc_diff_rat: number
  aqc_diff_score: number
  aqc_norm: number
  aqi_cl_exps: { [key in AqiClass]: number }
  aqi_m: number
  aqi_m_diff: number
  aqi_cl_pcts: { [key in AqiClass]: number }
  gvi_m: number
  gvi_m_diff: number
  gvi_cl_exps: { [key in GviClass]: number }
  gvi_cl_pcts: { [key in GviClass]: number }
  cost_coeff: number
  id: string
  len_diff: number
  len_diff_rat: number
  length: number
  mdB: number
  mdB_diff: number
  missing_aqi: boolean
  missing_gvi: boolean
  missing_noises: boolean
  nei: number
  nei_diff: number
  nei_diff_rat: number
  nei_norm: number
  noise_pcts: { [key in DbClass]: number }
  noise_range_exps: { [key in DbClass]: number }
  noises: { [key: number]: number }
  path_score: number
  type: PathType
}

interface RawPathFeature extends Feature {
  geometry: Geometry
  properties: RawPathProperties
}

interface RawPathFeatureCollection extends FeatureCollection {
  features: RawPathFeature[]
}

export interface PathProperties extends RawPathProperties {
  aqScore: number | null
  greeneryScore: number | null
  noisinessScore: number | null
  quietnessScore: number | null
}

export interface PathFeature extends Feature {
  geometry: Geometry
  properties: PathProperties
}

export interface PathFeatureCollection extends FeatureCollection {
  features: PathFeature[]
}

export interface EdgeFeature extends Feature {
  geometry: Geometry
  properties: { value: number; p_length: number }
}

export interface EdgeFeatureCollection extends FeatureCollection {
  features: EdgeFeature[]
}

export interface PathDataResponse {
  edge_FC: FeatureCollection
  path_FC: RawPathFeatureCollection
}

export interface PathData {
  edge_FC: FeatureCollection
  path_FC: PathFeatureCollection
}

export interface MapReducer {
  initialized: boolean
  zoomToBbox: [number, number, number, number]
  basemap: Basemap | undefined
  basemapChangeId: number
  loadedLayers: LayerId[]
  center: LngLat | {}
  zoom: number
}

export interface AirQualityLayerReducer {
  hasData: boolean
  loadingData: boolean
  dataTimeUtcSecs: number | undefined
  styleUpdateDelays: number
  waitingStyleUpdate: boolean
  updatingStyle: boolean
}

export interface UserLocationReducer {
  watchId: number
  expireTime: string
  error: string | null
  lngLat: LngLat | null
  userLocFC: PointFeatureCollection
  userLocHistory: [number, number][]
}

export interface NotificationReducer {
  text: string | null
  look: string | null
}

export interface PathsReducer {
  cleanPathsAvailable: boolean
  selectedTravelMode: TravelMode
  showingPathsOfTravelMode: TravelMode | null
  showingPathsOfExposureMode: ExposureMode | null
  showingStatsType: StatsType | null
  odCoords: OdCoords | null
  selPathFC: PathFeatureCollection
  shortPathFC: PathFeatureCollection
  quietPathFC: PathFeatureCollection
  cleanPathFC: PathFeatureCollection
  quietEdgeFC: EdgeFeatureCollection
  cleanEdgeFC: EdgeFeatureCollection
  openedPath: PathFeature | null
  lengthLimit: LengthLimit
  lengthLimits: LengthLimit[]
  waitingPaths: boolean
  showingPaths: boolean
  carTripInfo: CarTripInfo | undefined
  routingId: number
}

export interface PathListReducer {
  scrollToPath: string
  routingId: number
}

interface GeocodingProps {
  gid: string
  layer: string
  source: string
  name: string
  label: string
  neighbourhood: string
  confidence: number
  distance: number
  locality: string
  lngLat: LngLat
}

export interface GeocodingResult {
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: GeocodingProps
  type: 'Feature'
}

export interface OdPlace {
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: {
    label: string
    name: string
    locationType: LocationType
    odType: OdType
  }
  type: 'Feature'
}

export interface OriginReducer {
  error: string | null
  originInputText: string
  originOptions: GeocodingResult[]
  originOptionsVisible: boolean
  waitingUserLocOrigin: boolean
  originObject: OdPlace | null
}

export interface DestinationReducer {
  error: string | null
  destInputText: string
  destOptions: GeocodingResult[]
  destOptionsVisible: boolean
  destObject: OdPlace | null
}

export interface MapPopupReducer {
  visible: boolean
  lngLat: LngLat | {}
}

export interface VisitorReducer {
  visitedBefore: boolean
  usedOds: OdPlace[]
  gaDisabled: boolean
}

export interface UiReducer {
  lang: Lang
  info: boolean
  odPanelHidden: boolean
  pathPanel: boolean
  pathPanelContent: string | null
}

export interface ReduxState {
  map: MapReducer
  airQualityLayer: AirQualityLayerReducer
  userLocation: UserLocationReducer
  notification: NotificationReducer
  paths: PathsReducer
  pathList: PathListReducer
  origin: OriginReducer
  destination: DestinationReducer
  mapPopup: MapPopupReducer
  visitor: VisitorReducer
  ui: UiReducer
}

export interface UrlState {
  basemap: Basemap | undefined
  odPanelVisible: boolean
}

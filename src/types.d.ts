interface LngLat {
  lng: number
  lat: number
}

type Feature = import('@turf/helpers').Feature

type GeoJSONType = 'FeatureCollection'

interface FeatureCollection {
  type: GeoJSONType
  features: Feature[]
}

type MbMap = import('mapbox-gl').Map | null

interface PointFeature extends Feature {
  geometry: import('@turf/helpers').Point
  properties: { type: string }
}

interface PointFeatureCollection extends FeatureCollection {
  features: PointFeature[]
}

interface OdFeatureCollection extends FeatureCollection {
  features: OdPlace[]
}

interface PolygonFeature extends Feature {
  geometry: import('@turf/helpers').Polygon
}

interface PolygonFeatureCollection extends FeatureCollection {
  features: PolygonFeature[]
}

type Properties = import('@turf/helpers').Properties

enum TravelMode {
  WALK = 'walk',
  BIKE = 'bike',
}

enum ExposureMode {
  CLEAN = 'clean',
  QUIET = 'quiet',
}

enum PathType {
  SHORT = 'short',
  CLEAN = 'clean',
  QUIET = 'quiet',
}

enum StatsType {
  AQ = 'air quality',
  NOISE = 'noise',
}

interface LengthLimit {
  limit: number
  count: number
  label: string
  cost_coeff: number
}

type OdCoords = [[number, number], [number, number]]

enum AqiClass {
  1 = 1,
  2 = 2,
  3 = 3,
  4 = 4,
  5 = 5,
}

enum DbClass {
  40 = 40,
  45 = 45,
  50 = 50,
  55 = 55,
  60 = 60,
  65 = 65,
  70 = 70,
  75 = 75,
}

interface PathProperties extends Properties {
  aqc: number
  aqc_diff: number
  aqc_diff_rat: number
  aqc_diff_score: number
  aqc_norm: number
  aqi_cl_exps: { [key in AqiClass]: number }
  aqi_m: number
  aqi_m_diff: number
  aqi_pcts: { [key in AqiClass]: number }
  cost_coeff: number
  id: string
  len_diff: number
  len_diff_rat: number
  length: number
  mdB: number
  mdB_diff: number
  missing_aqi: boolean
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

interface PathFeature extends Feature {
  geometry: import('@turf/helpers').Geometry
  properties: PathProperties
}

interface PathFeatureCollection extends FeatureCollection {
  features: PathFeature[]
}

interface EdgeFeature extends Feature {
  geometry: import('@turf/helpers').Geometry
  properties: { value: number; p_length: number }
}

interface EdgeFeatureCollection extends FeatureCollection {
  features: EdgeFeature[]
}

interface PathDataResponse {
  edge_FC: FeatureCollection
  path_FC: PathFeatureCollection
}

interface MapReducer {
  initialized: boolean
  zoomToBbox: [number, number, number, number]
  basemap: import('./constants').Basemap | undefined
  basemapChangeId: number
  loadedLayers: import('./constants').LayerId[]
  center: LngLat | {}
  zoom: number
}

interface AirQualityLayerReducer {
  hasData: boolean
  loadingData: boolean
  dataTimeUtcSecs: number | undefined
  styleUpdateDelays: number
  waitingStyleUpdate: boolean
  updatingStyle: boolean
}

interface UserLocationReducer {
  watchId: number
  expireTime: string
  error: string | null
  lngLat: LngLat | null
  userLocFC: PointFeatureCollection
  userLocHistory: [number, number][]
}

interface NotificationReducer {
  text: string | null
  look: string | null
}

interface PathDataCache {
  od: OdCoords
  data: PathDataResponse
  travelMode: TravelMode
}

interface PathsReducer {
  cleanPathsAvailable: boolean
  selectedTravelMode: TravelMode
  showingPathsOfTravelMode: TravelMode | null
  showingPathsOfExposureMode: ExposureMode | null
  showingStatsType: StatsType | null
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
  routingId: number
}

interface PathListReducer {
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

interface GeocodingResult {
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: GeocodingProps
  type: 'Feature'
}

interface OdPlace {
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: {
    label: string
    name: string
    locationType: import('./reducers/originReducer').LocationType
    odType: import('./reducers/originReducer').OdType
  }
  type: 'Feature'
}

interface OriginReducer {
  error: string | null
  originInputText: string
  originOptions: GeocodingResult[]
  originOptionsVisible: boolean
  waitingUserLocOrigin: boolean
  originObject: OdPlace | null
}

interface DestinationReducer {
  error: string | null
  destInputText: string
  destOptions: GeocodingResult[]
  destOptionsVisible: boolean
  destObject: OdPlace | null
}

interface MapPopupReducer {
  visible: boolean
  lngLat: LngLat | {}
}

interface VisitorReducer {
  visitedBefore: boolean
  usedOds: OdPlace[]
  gaDisabled: boolean
}

interface UiReducer {
  lang: import('./reducers/uiReducer').Lang
  info: boolean
  odPanelHidden: boolean
  pathPanel: boolean
  pathPanelContent: string | null
}

interface ReduxState {
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

interface UrlState {
  basemap: import('./constants').Basemap | undefined
  odPanelVisible: boolean
}

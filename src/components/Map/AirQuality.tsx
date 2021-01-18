import { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import {
  setLoadingData,
  handleDataNotAvailable,
  setDataLoaded,
  setDelayedStyleUpdate,
  setWaitingStyleUpdate,
  setUpdatingStyle,
} from './../../reducers/airQualityLayerReducer'
import { aqiMapColorByAqiClass, Basemap, LayerId } from '../../constants'
import * as aqi from '../../services/aqi'

// prettier-ignore
const aqiLineColors = [
  'match',
  ['feature-state', 'aqi'],
  2, aqiMapColorByAqiClass[2],
  3, aqiMapColorByAqiClass[3],
  4, aqiMapColorByAqiClass[4],
  5, aqiMapColorByAqiClass[5],
  6, aqiMapColorByAqiClass[6],
  7, aqiMapColorByAqiClass[7],
  8, aqiMapColorByAqiClass[8],
  9, aqiMapColorByAqiClass[9],
  10, aqiMapColorByAqiClass[10],
  /* other */ '#3d3d3d'
]

const getUniqueFeatureIds = (features: any[]) => {
  const existingFeatureKeys: Map<number, boolean> = new Map()
  return features
    .map((feat) => feat.id)
    .filter((id) => {
      if (existingFeatureKeys.has(id)) {
        return false
      } else {
        existingFeatureKeys.set(id, true)
        return true
      }
    })
}

class AirQuality extends Component<PropsFromRedux & { map?: MbMap }> {
  layerId = LayerId.AQI_LAYER
  sourceLayer = LayerId.AQI_LAYER
  source = 'composite'
  data: Map<number, number> | undefined = undefined
  dataTimeUtcSecs: number | null = null

  updateAqiState = (map: any) => {
    this.props.setUpdatingStyle(true)
    this.props.setWaitingStyleUpdate(false)

    this.props.map!.setPaintProperty(this.layerId, 'line-color', aqiLineColors)
    const features = map!.queryRenderedFeatures(undefined, {
      layers: [this.layerId],
    })
    const uniqIds = getUniqueFeatureIds(features)

    // update feature states with new AQI values
    uniqIds.forEach((id) => {
      const aqi = this.data!.get(id)
      if (aqi) {
        map.setFeatureState(
          {
            source: this.source,
            sourceLayer: this.sourceLayer,
            id: id,
          },
          { aqi },
        )
      } else {
        console.log('Missing id for AQ feature')
      }
    })
    console.log('Updated AQIs to feature states')
    this.props.setUpdatingStyle(false)
  }

  /**
   * Triggers AQI map data fetch/update if new or initial AQI data is available.
   */
  maybeUpdateAqiData = async (repeat: boolean = true) => {
    if (this.props.basemap === Basemap.AIR_QUALITY && !this.props.layer.loadingData) {
      const server = await aqi.getAqiMapDataStatus()
      if (
        server.aqi_map_data_utc_time_secs && //i.e. aqi map data is available
        (!this.dataTimeUtcSecs || this.dataTimeUtcSecs < server.aqi_map_data_utc_time_secs)
      ) {
        console.log('fetching new AQI map data:', server.aqi_map_data_utc_time_secs)
        this.props.setLoadingData(true)
        try {
          this.data = await aqi.getAqiLayerData()
          this.dataTimeUtcSecs = server.aqi_map_data_utc_time_secs
          this.props.setDataLoaded(server.aqi_map_data_utc_time_secs)
          this.props.setDelayedStyleUpdate(100)
        } catch (error) {
          console.log('error in fetching new AQI map data')
        }
        this.props.setLoadingData(false)
      }
    }
    if (repeat) {
      setTimeout(this.maybeUpdateAqiData, 4000)
    }
  }

  componentDidMount = async () => {
    setTimeout(this.maybeUpdateAqiData, 4000)
    this.props.map!.on('sourcedata', (e) => {
      if (
        e.isSourceLoaded &&
        e.sourceId === this.source &&
        this.props.basemap === Basemap.AIR_QUALITY &&
        this.data
      ) {
        this.props.setDelayedStyleUpdate(500)
      }
    })
  }

  /**
   * Let's update AQI features' states only after a short delay after either changed map view or new
   * source data download. This way we can avoid unnecessarily updating the feature states multiple
   * times due to single change in map view.
   */
  componentDidUpdate = async (prevProps: PropsFromRedux) => {
    if (this.props.basemap !== Basemap.AIR_QUALITY) return

    // add delayed AQI map update to "queue" if basemap changes
    if (prevProps.basemap !== Basemap.AIR_QUALITY) {
      console.log('Changed basemap to AIR QUALITY')
      if (!this.data) {
        await this.maybeUpdateAqiData(false)
      } else {
        this.props.setDelayedStyleUpdate(200)
      }
      if (!this.data) {
        this.props.handleDataNotAvailable()
      }
    }

    // add delayed AQI map update to "queue" if map center changes
    if (JSON.stringify(prevProps.mapCenter) !== JSON.stringify(this.props.mapCenter) && this.data) {
      this.props.setDelayedStyleUpdate(1300)
    }

    // implement the AQI style update if and only after all update delays have passed
    if (
      this.props.layer.waitingStyleUpdate &&
      this.props.layer.styleUpdateDelays === 0 &&
      prevProps.layer.styleUpdateDelays > 0 &&
      this.props.map &&
      this.data
    ) {
      // trigger AQI map style update if necessary
      this.updateAqiState(this.props.map)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = (state: ReduxState) => ({
  basemap: state.map.basemap,
  layer: state.airQualityLayer,
  mapCenter: state.map.center,
})

const connector = connect(mapStateToProps, {
  setLoadingData,
  handleDataNotAvailable,
  setDataLoaded,
  setWaitingStyleUpdate,
  setUpdatingStyle,
  setDelayedStyleUpdate,
})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(AirQuality)

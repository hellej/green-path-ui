import { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import {
  setDataLoaded,
  resetAirQualityLayer,
  setDelayedStyleUpdate,
  setWaiting,
  setLoading,
} from './../../reducers/airQualityLayerReducer'
import { aqiClassColors, Basemap, LayerId } from '../../constants'
import * as aqi from '../../services/aqi'

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

// prettier-ignore
const aqiLineColors = [
  'match',
  ['feature-state', 'aqi'],
  2, aqiClassColors[2],
  3, aqiClassColors[3],
  4, aqiClassColors[4],
  5, aqiClassColors[5],
  6, aqiClassColors[6],
  7, aqiClassColors[7],
  8, aqiClassColors[8],
  9, aqiClassColors[9],
  10, aqiClassColors[10],
  /* other */ '#3d3d3d'
]

class AirQuality extends Component<PropsFromRedux & { map?: MbMap }> {
  layerId = LayerId.AQI_LAYER
  sourceLayer = LayerId.AQI_LAYER
  source = 'composite'
  data = undefined as Map<number, number> | undefined

  updateAqiState = (map: any) => {
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
    this.props.setLoading(false)
  }

  componentDidMount = async () => {
    const { map } = this.props
    this.data = await aqi.getAqiLayerData()
    this.props.setDataLoaded()

    map!.on('sourcedata', (e) => {
      if (
        e.sourceId === this.source &&
        e.isSourceLoaded &&
        this.props.basemap === Basemap.AIR_QUALITY
      ) {
        this.props.setDelayedStyleUpdate(1000)
        if (!this.props.layer.waiting) {
          this.props.setWaiting(true)
        }
      }
    })
  }

  /**
   * Let's update AQI features' states only after a short delay after either changed map view or new
   * source data download. This way we can avoid unnecessarily updating the feature states multiple
   * times due to single change in map view.
   */
  componentDidUpdate = (prevProps: PropsFromRedux) => {
    if (this.props.basemap !== Basemap.AIR_QUALITY) return

    // add delayed AQI map update to "queue" if basemap changes
    if (prevProps.basemap !== Basemap.AIR_QUALITY) {
      console.log('Changed basemap to AIR QUALITY')
      this.props.resetAirQualityLayer()
      this.props.setWaiting(true)
      this.props.setDelayedStyleUpdate(1000)
    }

    // add delayed AQI map update to "queue" if map center changes
    if (JSON.stringify(prevProps.mapCenter) !== JSON.stringify(this.props.mapCenter)) {
      this.props.resetAirQualityLayer()
      this.props.setWaiting(true)
      this.props.setDelayedStyleUpdate(1000)
    }

    // implement the AQI style update only after all update delays have passed
    if (
      this.props.layer.waiting &&
      this.props.layer.waitingLoadsCount === 0 &&
      prevProps.layer.waitingLoadsCount > 0 &&
      this.props.map
    ) {
      // trigger AQI map style update if necessary
      this.props.setWaiting(false)
      this.props.setLoading(true)
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
  setDataLoaded,
  resetAirQualityLayer,
  setWaiting,
  setLoading,
  setDelayedStyleUpdate,
})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(AirQuality)

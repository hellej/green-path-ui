import { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { setSelectedPath } from '../../reducers/pathsReducer'
import { setLayerLoaded } from './../../reducers/mapReducer'
import { aqiColors, Basemap, LayerId } from '../../constants'
import * as aqi from '../../services/aqi'

const getUniqueFeatureIds = (features: any[]) => {
  const existingFeatureKeys: Map<number, boolean> = new Map()
  return features
    .map(feat => feat.id)
    .filter((id) => {
      if (existingFeatureKeys.has(id)) {
        return false
      } else {
        existingFeatureKeys.set(id, true)
        return true
      }
    })
}

const aqiLineColors = [
  'match',
  ['feature-state', 'aqi'],
  2, aqiColors[1],
  3, aqiColors[2],
  4, aqiColors[3],
  5, aqiColors[4],
  6, aqiColors[5],
  7, aqiColors[5],
  8, aqiColors[5],
  9, aqiColors[5],
  10, aqiColors[5],
  11, aqiColors[5],
  /* other */ '#3d3d3d'
]

class AirQuality extends Component<PropsFromRedux & { map?: MbMap }> {
  layerId = LayerId.AQI_LAYER
  sourceLayer = LayerId.AQI_LAYER
  source = 'composite'
  data = undefined as Map<number, number> | undefined

  updateAqiState = (map: any) => {
    console.log('Updating AQI to map...')

    this.props.map!.setPaintProperty(this.layerId, 'line-color', aqiLineColors)

    const features = map!.queryRenderedFeatures(undefined, { layers: [this.layerId] })
    const uniqIds = getUniqueFeatureIds(features)

    // update feature states with aqi
    uniqIds.forEach((id) => {
      const aqi = this.data!.get(id)
      if (aqi) {
        map.setFeatureState({
          source: this.source,
          sourceLayer: this.sourceLayer,
          id: id,
        }, { aqi })
      } else {
        console.log('missing id')
      }
    })
    console.log('Updated AQIs to feature states');
  }

  componentDidMount = () => {
    const { map } = this.props
    this.data = aqi.getAqiLayerData()

    map!.on('sourcedata', (e) => {
      if (e.isSourceLoaded && this.props.basemap === Basemap.AIR_QUALITY) {
        if (map && this.data) {
          this.updateAqiState(map)
        }
      }
    })
  }

  componentDidUpdate = (prevProps: PropsFromRedux) => {
    if (this.props.basemap !== prevProps.basemap && this.props.basemap === Basemap.AIR_QUALITY) {
      console.log('Changed basemap to AIR QUALITY');
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = (state: ReduxState) => ({
  basemap: state.map.basemap,
})

const connector = connect(mapStateToProps, { setSelectedPath, setLayerLoaded })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(AirQuality)

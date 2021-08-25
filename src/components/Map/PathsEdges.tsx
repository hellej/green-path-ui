import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { GeoJSONSource } from 'mapbox-gl'
import { setSelectedPath } from '../../reducers/pathsReducer'
import { setLayerLoaded } from './../../reducers/mapReducer'
import { dBColors, colorByAqiClass, colorByGviClass, LayerId } from '../../constants'
import { EnvExposureMode, ReduxState } from '../../types'
import GeoJSON from 'geojson'
import { ExposureMode } from '../../services/paths'

// prettier-ignore
const gviLineColors = [
  'match',
  ['get', 'value'],
  0, colorByGviClass[0],
  1, colorByGviClass[1],
  2, colorByGviClass[2],
  3, colorByGviClass[3],
  4, colorByGviClass[4],
  5, colorByGviClass[5],
  6, colorByGviClass[6],
  7, colorByGviClass[7],
  8, colorByGviClass[8],
  9, colorByGviClass[9],
  10, colorByGviClass[10],
  /* other */ 'white',
]

// prettier-ignore
const dbLineColors = [
  'match',
  ['get', 'value'],
  40, dBColors[40],
  50, dBColors[50],
  55, dBColors[55],
  60, dBColors[60],
  65, dBColors[65],
  70, dBColors[70],
  /* other */ 'white',
]

// prettier-ignore
const aqiLineColors = [
  'match',
  ['get', 'value'],
  1, colorByAqiClass[1],
  2, colorByAqiClass[2],
  3, colorByAqiClass[3],
  4, colorByAqiClass[4],
  5, colorByAqiClass[5],
  6, colorByAqiClass[6],
  7, colorByAqiClass[7],
  8, colorByAqiClass[8],
  9, colorByAqiClass[9],
  /* other */ 'white',
]

type EdgeColors = typeof gviLineColors

const colorScaleByExposureMode: Record<EnvExposureMode, EdgeColors> = {
  [ExposureMode.GREEN]: gviLineColors,
  [ExposureMode.QUIET]: dbLineColors,
  [ExposureMode.CLEAN]: aqiLineColors,
}

class PathsEdges extends React.Component<PropsFromRedux> {
  layerId = LayerId.PATHS_EDGES
  source: GeoJSONSource | undefined
  paint = {
    'line-width': 2.2,
    'line-opacity': 1,
    'line-color': dbLineColors,
  }
  layout = {
    'line-join': 'round',
    'line-cap': 'round',
  }

  loadLayerToMap(map: any) {
    // Add layer
    map.addSource(this.layerId, { type: 'geojson', data: this.props.pathEdgeFC })
    this.source = map.getSource(this.layerId)
    map.addLayer({
      id: this.layerId,
      source: this.layerId,
      type: 'line',
      paint: this.paint,
      layout: this.layout,
    })
    this.props.setLayerLoaded(this.layerId)
  }

  updateLayerData(map: any) {
    const { showingPathsOfExposureMode, pathEdgeFC, lengthLimit } = this.props

    const lineColor = showingPathsOfExposureMode
      ? colorScaleByExposureMode[showingPathsOfExposureMode]
      : 'white'

    if (this.source !== undefined) {
      this.source.setData(pathEdgeFC as GeoJSON.FeatureCollection<GeoJSON.Geometry>)
      map.setFilter(this.layerId, ['<=', 'p_length', lengthLimit.limit])
      map.setPaintProperty(this.layerId, 'line-color', lineColor)
    } else {
      map.once('sourcedata', () => {
        if (this.source) {
          this.source.setData(pathEdgeFC as GeoJSON.FeatureCollection<GeoJSON.Geometry>)
        }
      })
      map.setFilter(this.layerId, ['<=', 'p_length', lengthLimit.limit])
      map.setPaintProperty(this.layerId, 'line-color', lineColor)
    }
  }

  componentDidMount() {
    // @ts-ignore - map is given to all children of Map
    const { map } = this.props
    map.once('load', () => {
      this.loadLayerToMap(map)
    })
  }

  componentDidUpdate = (prevProps: PropsFromRedux) => {
    // @ts-ignore - map is given to all children of Map
    const { map } = this.props

    if (this.props.basemapChangeId !== prevProps.basemapChangeId) {
      this.loadLayerToMap(map)
      this.updateLayerData(map)
    } else {
      this.updateLayerData(map)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = (state: ReduxState) => ({
  showingPathsOfExposureMode: state.paths.showingPathsOfExposureMode,
  pathEdgeFC: state.paths.pathEdgeFC,
  lengthLimit: state.paths.lengthLimit,
  basemapChangeId: state.map.basemapChangeId,
})

const connector = connect(mapStateToProps, { setSelectedPath, setLayerLoaded })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(PathsEdges)

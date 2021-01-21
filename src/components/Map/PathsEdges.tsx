import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { GeoJSONSource } from 'mapbox-gl'
import { setSelectedPath } from '../../reducers/pathsReducer'
import { setLayerLoaded } from './../../reducers/mapReducer'
import { dBColors, colorByAqiClass, ExposureMode, LayerId } from '../../constants'

const dbLineColors = [
  'match',
  ['get', 'value'],
  40, dBColors[40],
  50, dBColors[50],
  55, dBColors[55],
  60, dBColors[60],
  65, dBColors[65],
  70, dBColors[70],
  /* other */ 'white'
]

const aqiLineColors = [
  'match',
  ['get', 'value'],
  2, colorByAqiClass[2],
  3, colorByAqiClass[3],
  4, colorByAqiClass[4],
  5, colorByAqiClass[5],
  6, colorByAqiClass[6],
  7, colorByAqiClass[7],
  8, colorByAqiClass[8],
  9, colorByAqiClass[9],
  10, colorByAqiClass[10],
  /* other */ 'white'
]

class PathsEdges extends React.Component<PropsFromRedux> {
  layerId = LayerId.PATHS_EDGES
  source: GeoJSONSource | undefined
  paint = {
    'line-width': 2.2,
    'line-opacity': 1,
    'line-color': dbLineColors
  }
  layout = {
    'line-join': 'round',
    'line-cap': 'round',
  }

  loadLayerToMap(map: any) {
    // Add layer
    map.addSource(this.layerId, { type: 'geojson', data: this.props.quietEdgeFC })
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
    const { showingPathsOfExposureMode, quietEdgeFC, cleanEdgeFC, lengthLimit } = this.props
    let greenEdgeFC: any
    let lineColor
    if (showingPathsOfExposureMode === ExposureMode.CLEAN) {
      greenEdgeFC = cleanEdgeFC
      lineColor = aqiLineColors
    } else {
      greenEdgeFC = quietEdgeFC
      lineColor = dbLineColors
    }

    if (this.source !== undefined) {
      this.source.setData(greenEdgeFC)
      map.setFilter(this.layerId, ['<=', 'p_length', lengthLimit.limit])
      map.setPaintProperty(this.layerId, 'line-color', lineColor)
    } else {
      map.once('sourcedata', () => {
        if (this.source) {
          this.source.setData(greenEdgeFC)
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
  quietEdgeFC: state.paths.quietEdgeFC,
  cleanEdgeFC: state.paths.cleanEdgeFC,
  lengthLimit: state.paths.lengthLimit,
  basemapChangeId: state.map.basemapChangeId,
})

const connector = connect(mapStateToProps, { setSelectedPath, setLayerLoaded })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(PathsEdges)

import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { GeoJSONSource, MapMouseEvent } from 'mapbox-gl'
import { setSelectedPath } from '../../reducers/pathsReducer'
import { scrollToPath } from '../../reducers/pathListReducer'
import { setLayerLoaded } from './../../reducers/mapReducer'
import { clickTol, ExposureMode, LayerId } from '../../constants'
import { utils } from '../../utils/index'

class PathsGreen extends React.Component<PropsFromRedux> {
  layerId = LayerId.GREEN_PATHS
  source: GeoJSONSource | undefined
  paint = {
    'line-width': 4.3,
    'line-opacity': 1,
    'line-color': '#252525',
  }
  layout = {
    'line-join': 'round',
    'line-cap': 'round',
  }

  loadLayerToMap(map: any) {
    map.addSource(this.layerId, { type: 'geojson', data: this.props.quietPathFC })
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
    const { showingPathsOfExposureMode, quietPathFC, cleanPathFC, lengthLimit } = this.props
    let greenPathsFC: PathFeatureCollection
    if (showingPathsOfExposureMode === ExposureMode.CLEAN) {
      greenPathsFC = cleanPathFC
    } else {
      greenPathsFC = quietPathFC
    }

    if (this.source !== undefined) {
      // @ts-ignore - it's valid geojson
      this.source.setData(greenPathsFC)
      map.setFilter(this.layerId, ['<=', 'length', lengthLimit.limit])
    } else {
      map.once('sourcedata', () => {
        if (this.source) {
          // @ts-ignore - it's valid geojson
          this.source.setData(greenPathsFC)
        }
      })
      map.setFilter(this.layerId, ['<=', 'length', lengthLimit.limit])
    }
  }

  componentDidMount() {
    // @ts-ignore - map is given to all children of Map
    const { map } = this.props
    const { setSelectedPath, scrollToPath } = this.props

    map.once('load', () => {
      this.loadLayerToMap(map)

      map.on('mouseenter', this.layerId, () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', this.layerId, () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('click', (e: MapMouseEvent) => {
        const features = utils.getLayersFeaturesAroundClickE([this.layerId], e, clickTol, map)
        if (features.length > 0) {
          const clickedFeat = features[0]
          setSelectedPath(clickedFeat.properties!.id)
          scrollToPath(clickedFeat.properties!.id)
        }
      })
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
  quietPathFC: state.paths.quietPathFC,
  cleanPathFC: state.paths.cleanPathFC,
  lengthLimit: state.paths.lengthLimit,
  basemapChangeId: state.map.basemapChangeId,
})

const connector = connect(mapStateToProps, { setSelectedPath, scrollToPath, setLayerLoaded })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(PathsGreen)

import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { GeoJSONSource } from 'mapbox-gl'
import { setLayerLoaded } from './../../reducers/mapReducer'
import { LayerId } from '../../constants'
import { ReduxState } from '../../types'

class PathSelected extends React.Component<PropsFromRedux> {
  layerId = LayerId.SELECTED_PATH
  source: GeoJSONSource | undefined
  layout = {
    'icon-image': 'circle-15',
    'icon-size': 0.7,
    'symbol-placement': 'line',
    'symbol-spacing': 22,
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
  }

  loadLayerToMap(map: any) {
    map.addSource(this.layerId, { type: 'geojson', data: this.props.selPathFC })
    this.source = map.getSource(this.layerId)
    map.addLayer({
      id: this.layerId,
      source: this.layerId,
      type: 'symbol',
      layout: this.layout,
    })
    this.props.setLayerLoaded(this.layerId)
  }

  updateLayerData(map: any) {
    const { selPathFC, lengthLimit } = this.props

    if (this.source !== undefined) {
      // @ts-ignore - it's valid geojson
      this.source.setData(selPathFC)
      map.setFilter(this.layerId, ['<=', 'length', lengthLimit.limit])
    } else {
      map.once('sourcedata', () => {
        if (this.source) {
          // @ts-ignore - it's valid geojson
          this.source.setData(selPathFC)
        }
      })
      map.setFilter(this.layerId, ['<=', 'length', lengthLimit.limit])
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
  selPathFC: state.paths.selPathFC,
  lengthLimit: state.paths.lengthLimit,
  basemapChangeId: state.map.basemapChangeId,
})

const connector = connect(mapStateToProps, { setLayerLoaded })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(PathSelected)

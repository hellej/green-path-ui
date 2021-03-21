import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { GeoJSONSource } from 'mapbox-gl'
import { setLayerLoaded } from './../../reducers/mapReducer'
import { LayerId } from '../../constants'

class UserLocation extends React.Component<PropsFromRedux> {
  layerId = LayerId.USER_LOC
  source: GeoJSONSource | undefined
  circleStyle = {
    'circle-stroke-color': '#ff38ff',
    'circle-color': 'transparent',
    'circle-radius': 10,
    'circle-stroke-width': 2.5,
  }

  loadLayerToMap(map: any) {
    // Add layer
    map.addSource(this.layerId, { type: 'geojson', data: this.props.userLocFC })
    this.source = map.getSource(this.layerId)
    map.addLayer({
      id: this.layerId,
      source: this.layerId,
      type: 'circle',
      paint: this.circleStyle,
    })
    this.props.setLayerLoaded(this.layerId)
  }

  updateLayerData(map: any) {
    const { userLocFC } = this.props

    if (this.source !== undefined) {
      this.source.setData(userLocFC)
    } else {
      map.once('sourcedata', () => {
        if (this.source) {
          this.source.setData(userLocFC)
        }
      })
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
    } else {
      this.updateLayerData(map)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = (state: ReduxState) => ({
  userLocFC: state.userLocation.userLocFC,
  basemapChangeId: state.map.basemapChangeId,
})

const connector = connect(mapStateToProps, { setLayerLoaded })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(UserLocation)

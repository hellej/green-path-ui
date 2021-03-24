import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { GeoJSONSource, MapMouseEvent } from 'mapbox-gl'
import { setMapReferenceForPopups, setSelectLocationsPopup } from './../../reducers/mapPopupReducer'
import { setLayerLoaded } from './../../reducers/mapReducer'
import { clickTol, LayerId } from './../../constants'
import { utils, turf } from './../../utils/index'
import { OdPlace, ReduxState } from '../../types'

class OrigDest extends React.Component<PropsFromRedux> {
  layerId = LayerId.ORIG_DEST
  source: GeoJSONSource | undefined = undefined
  circleStyle = {
    'circle-color': [
      'match',
      ['get', 'odType'],
      'orig',
      '#00fffa',
      'dest',
      '#00ff4c',
      /* other */ '#51ff7c',
    ],
    'circle-stroke-color': 'black',
    'circle-radius': 5,
    'circle-stroke-width': 2,
  }

  loadLayerToMap(map: any) {
    const { originPoint, destinationPoint, setLayerLoaded } = this.props
    // @ts-ignore
    const odFeatures: OdPlace[] = [originPoint, destinationPoint].filter(od => od)
    const origDestFC = turf.asFeatureCollection(odFeatures)
    // Add layer
    map.addSource(this.layerId, { type: 'geojson', data: origDestFC })
    this.source = map.getSource(this.layerId)
    map.addLayer({
      id: this.layerId,
      source: this.layerId,
      type: 'circle',
      paint: this.circleStyle,
    })
    setLayerLoaded(this.layerId)
  }

  updateLayerData(map: any) {
    const { originPoint, destinationPoint } = this.props
    // @ts-ignore
    const odFeatures: OdPlace[] = [originPoint, destinationPoint].filter(od => od)
    const origDestFC = turf.asFeatureCollection(odFeatures)

    if (this.source !== undefined) {
      this.source.setData(origDestFC)
    } else {
      map.once('sourcedata', () => {
        if (this.source) {
          this.source.setData(origDestFC)
        }
      })
    }
  }

  componentDidMount() {
    // @ts-ignore - this is given to all children of Map
    const { map } = this.props

    this.loadLayerToMap(map)

    const { setSelectLocationsPopup } = this.props

    map.once('load', () => {
      setMapReferenceForPopups(map)
      map.on('click', (e: MapMouseEvent) => {
        // show popup only if path was not clicked
        const features = utils.getLayersFeaturesAroundClickE(
          [LayerId.GREEN_PATHS, LayerId.SHORT_PATH],
          e,
          clickTol,
          map,
        )
        if (features.length === 0) {
          setSelectLocationsPopup(e.lngLat)
        }
      })
    })
  }

  componentDidUpdate = (prevProps: PropsFromRedux) => {
    // @ts-ignore - map is given to all children of Map
    const { map } = this.props

    this.updateLayerData(map)

    if (this.props.basemapChangeId !== prevProps.basemapChangeId) {
      this.loadLayerToMap(map)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = (state: ReduxState) => ({
  originPoint: state.origin.originObject,
  destinationPoint: state.destination.destObject,
  basemapChangeId: state.map.basemapChangeId,
})

const connector = connect(mapStateToProps, { setSelectLocationsPopup, setLayerLoaded })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(OrigDest)

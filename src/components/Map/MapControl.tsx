import { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LayerId } from '../../constants'
import { MbMap, ReduxState } from '../../types'
import { setBaseMapChanged, unloadLayers } from './../../reducers/mapReducer'

class MapControl extends Component<PropsFromRedux & { map?: MbMap }> {
  getFitBoundsOptions = (showingPaths: boolean) => {
    if (window.innerWidth < 544) {
      if (showingPaths) {
        return { padding: { top: 110, bottom: 280, left: 40, right: 40 } }
      } else {
        return { padding: { top: 190, bottom: 170, left: 40, right: 40 } }
      }
    } else return { padding: { top: 120, bottom: 90, left: 390, right: 70 } }
  }

  componentDidUpdate = (prevProps: PropsFromRedux) => {
    const { map, showingPaths, unloadLayers, loadedLayers } = this.props
    const { zoomToBbox } = this.props.mapState

    const { userLocHistory } = this.props.userLocation

    if (userLocHistory.length === 1 && prevProps.userLocation.userLocHistory.length === 0) {
      map!.easeTo({ center: userLocHistory[0], zoom: 13.7 })
    }

    if (zoomToBbox !== prevProps.mapState.zoomToBbox) {
      map!.fitBounds(zoomToBbox, this.getFitBoundsOptions(showingPaths))
    }

    if (
      prevProps.mapState.basemap &&
      this.props.mapState.basemap &&
      prevProps.mapState.basemap !== this.props.mapState.basemap
    ) {
      unloadLayers()
      map!.setStyle(this.props.mapState.basemap)
      map!.once('styledataloading', () => {
        map!.once('styledata', () => {
          this.props.setBaseMapChanged()
        })
      })
    }

    if (loadedLayers.length === 7 && prevProps.loadedLayers.length < 7) {
      map!.moveLayer(LayerId.USER_LOC)
      map!.moveLayer(LayerId.ORIG_DEST, LayerId.USER_LOC)
      map!.moveLayer(LayerId.PATHS_EDGES, LayerId.ORIG_DEST)
      map!.moveLayer(LayerId.GREEN_PATHS, LayerId.PATHS_EDGES)
      map!.moveLayer(LayerId.SHORT_PATH, LayerId.GREEN_PATHS)
      map!.moveLayer(LayerId.SELECTED_PATH, LayerId.SHORT_PATH)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = (state: ReduxState) => ({
  userLocation: state.userLocation,
  mapState: state.map,
  showingPaths: state.paths.waitingPaths || state.paths.showingPaths,
  loadedLayers: state.map.loadedLayers,
})

const connector = connect(mapStateToProps, { setBaseMapChanged, unloadLayers })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(MapControl)

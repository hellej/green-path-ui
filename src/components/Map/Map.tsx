import React, { Component } from 'react'
import MapboxGL from 'mapbox-gl'
import { connect, ConnectedProps } from 'react-redux'
import { initializeMap, updateCamera, setLayerLoaded } from './../../reducers/mapReducer'
import { debugNearestEdgeAttrs } from '../../services/paths'
import { unsetSelectedPath } from './../../reducers/pathsReducer'
import { initialMapCenter, initialMapCenterProd, Basemap, LayerId } from './../../constants'
import { utils } from './../../utils/index'
import { clickTol } from './../../constants'

MapboxGL.accessToken = process.env.REACT_APP_MB_ACCESS || 'Mapbox token is needed in order to use the map'

const mapCenter = process.env.NODE_ENV === 'development' ? initialMapCenter : initialMapCenterProd
const zoom = process.env.NODE_ENV === 'development' ? 13 : 12

interface PropsType {
  children: JSX.Element[],
}

interface Props {
  basemap: Basemap | undefined
}

type State = {
  loaded: boolean,
  isReady: boolean,
  flying: boolean
}

class Map extends Component<PropsType & Props & PropsFromRedux, State> {
  map: MbMap = null
  mapContainer: any

  state: State = {
    isReady: false,
    loaded: false,
    flying: false,
  }

  componentDidMount() {

    this.setupMapWindow()

    this.map = new MapboxGL.Map({
      container: this.mapContainer,
      style: this.props.basemap || Basemap.STREETS,
      center: mapCenter,
      zoom: zoom,
      boxZoom: false,
      trackResize: true
    })

    this.map.on('style.load', () => {
      console.log('map style loaded')
      this.props.setLayerLoaded(LayerId.BASEMAP)
    })

    this.map.on('render', () => {
      if (!this.state.isReady) this.setState({ isReady: true })
    })

    this.map.on('load', () => {
      this.setState({ loaded: true, isReady: true })
      this.map!.touchZoomRotate.disableRotation()
      this.map!.dragRotate.disable()
      this.props.initializeMap()
    })

    this.map.on('moveend', () => {
      this.props.updateCamera(this.map!.getCenter(), this.map!.getZoom())
    })

    this.map.on('click', (e: any) => {
      if (process.env.NODE_ENV === 'development') {
        debugNearestEdgeAttrs(e.lngLat)
      }
      const features = utils.getLayersFeaturesAroundClickE([LayerId.GREEN_PATHS, LayerId.SHORT_PATH], e, clickTol, this.map!)
      if (features.length === 0) {
        this.props.unsetSelectedPath()
      }
    })

  }

  componentDidUpdate(prevProps: PropsFromRedux, prevState: State) {
    if (!this.map) return

    if (!prevState.isReady && this.state.isReady) {
      this.props.updateCamera(this.map!.getCenter(), this.map!.getZoom())
    }
  }

  setupMapWindow = () => {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
    window.addEventListener('orientationchange', this.updateWindowDimensions)
    this.mapContainer.addEventListener('touchmove', (e: any) => { e.preventDefault() }, { passive: false })
  }

  updateWindowDimensions = () => {
    if (!this.map) return
    this.forceUpdate()
    setTimeout(() => { this.resizeMap() }, 300)
  }

  resizeMap = () => {
    if (!this.map) return
    this.map.resize()
  }

  componentWillUnmount() {
    setTimeout(() => this.map!.remove(), 300)
    window.removeEventListener('resize', this.updateWindowDimensions)
    window.removeEventListener('orientationchange', this.updateWindowDimensions)
  }

  render() {
    const mapStyle: any = {
      position: 'relative',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      margin: 0,
      width: '100%',
      height: window.innerHeight,
      overflow: 'hidden',
      touchAction: 'none'
    }

    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child as React.ReactElement<any>, { map: this.map }))

    return (
      <div style={mapStyle} ref={el => { this.mapContainer = el }}>
        {this.state.isReady && this.map !== null && children}
      </div>
    )
  }
}

const mapDispatchToProps = {
  initializeMap,
  updateCamera,
  unsetSelectedPath,
  setLayerLoaded,
}

const connector = connect(null, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(Map)

import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { getStateFromUrl } from './utils/urlManager'
import Notification from './components/Notification'
import FindPathsButtons from './components/FindPathsButtons'
import TopPanel from './components/TopPanel/TopPanel'
import BottomControlPanel from './components/BottomControlPanel/BottomControlPanel'
import PathPanel from './components/PathPanel/PathPanel'
import Map from './components/Map/Map'
import MapControl from './components/Map/MapControl'
import AirQuality from './components/Map/AirQuality'
import UserLocation from './components/Map/UserLocation'
import PathShort from './components/Map/PathShort'
import PathSelected from './components/Map/PathSelected'
import PathsEnvOptimized from './components/Map/PathsEnvOptimized'
import PathsEdges from './components/Map/PathsEdges'
import OrigDestPoints from './components/Map/OrigDestPoints'
import WelcomeInfo from './scenes/WelcomeInfo/WelcomeInfo'
import DimLayer from './scenes/Home/DimLayer'
import HopeLink from './scenes/Home/HopeLink'
import { loadSelectedLanguage } from './reducers/uiReducer'
import { testGreenPathServiceConnection, testCleanPathServiceStatus } from './reducers/pathsReducer'
import {
  setStateFromUrl,
  showWelcomeIfFirstVisit,
  maybeDisableAnalyticsCookies,
} from './reducers/visitorReducer'
import { UrlState } from './types'

const AbsoluteContainer = styled.div`
  position: absolute;
  pointer-events: none;
`
const TopPanelContainer = styled(AbsoluteContainer)`
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 4;
`
const BottomPanel = styled(AbsoluteContainer)`
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 3;
`

type State = {
  urlState: UrlState | null
}

class App extends Component<PropsFromRedux & RouteComponentProps, State> {
  constructor(props: PropsFromRedux & RouteComponentProps) {
    super(props)
    this.state = { urlState: null }
  }

  componentDidMount() {
    const urlState = getStateFromUrl(this.props.location)
    this.setState({ urlState })
    this.props.setStateFromUrl(urlState, this.props.location, this.props.history)
    this.props.loadSelectedLanguage()
    this.props.maybeDisableAnalyticsCookies()
    this.props.showWelcomeIfFirstVisit()
    this.props.testCleanPathServiceStatus()
    this.props.testGreenPathServiceConnection()
  }

  render() {
    return (
      <Fragment>
        <DimLayer />
        <HopeLink />
        {this.state.urlState && (
          <Map basemap={this.state.urlState.basemap}>
            <MapControl />
            <AirQuality />
            <PathSelected />
            <PathsEnvOptimized />
            <PathShort />
            <PathsEdges />
            <OrigDestPoints />
            <UserLocation />
          </Map>
        )}
        <WelcomeInfo />
        <BottomPanel>
          <Notification />
          <FindPathsButtons />
          <PathPanel />
          <BottomControlPanel />
        </BottomPanel>
        <TopPanelContainer>
          <TopPanel />
        </TopPanelContainer>
      </Fragment>
    )
  }
}

const mapDispatchToProps = {
  loadSelectedLanguage,
  showWelcomeIfFirstVisit,
  maybeDisableAnalyticsCookies,
  testGreenPathServiceConnection,
  testCleanPathServiceStatus,
  setStateFromUrl,
}

const connector = connect(null, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(App)

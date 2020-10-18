import React, { Component } from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
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
import PathsGreen from './components/Map/PathsGreen'
import PathsEdges from './components/Map/PathsEdges'
import OrigDestPoints from './components/Map/OrigDestPoints'
import WelcomeInfo from './scenes/WelcomeInfo/WelcomeInfo'
import DimLayer from './scenes/Home/DimLayer'
import HopeLink from './scenes/Home/HopeLink'
import { loadSelectedLanguage } from './reducers/uiReducer'
import { testGreenPathServiceConnection, testCleanPathServiceStatus } from './reducers/pathsReducer'
import { showWelcomeIfFirstVisit, maybeDisableAnalyticsCookies } from './reducers/visitorReducer'

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

class App extends Component<PropsFromRedux> {

  componentDidMount() {
    this.props.loadSelectedLanguage()
    this.props.maybeDisableAnalyticsCookies()
    this.props.showWelcomeIfFirstVisit()
    this.props.testCleanPathServiceStatus()
    this.props.testGreenPathServiceConnection()
  }

  render() {
    return (
      <div>
        <DimLayer />
        <HopeLink />
        <Map>
          <MapControl />
          <AirQuality />
          <PathSelected />
          <PathsGreen />
          <PathShort />
          <PathsEdges />
          <OrigDestPoints />
          <UserLocation />
        </Map>
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
      </div>
    )
  }
}

const mapDispatchToProps = {
  loadSelectedLanguage,
  showWelcomeIfFirstVisit,
  maybeDisableAnalyticsCookies,
  testGreenPathServiceConnection,
  testCleanPathServiceStatus,
}

const connector = connect(null, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(App)

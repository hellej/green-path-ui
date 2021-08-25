import React from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import Favicon from './favicon-32x32.png'
import RoutingSettingsRow from './RoutingSettingsRow'
import ShowInfoButton from './ShowInfoButton'
import OrigDestPanel from './OrigDestPanel'
import BasemapSelector from './BasemapSelector'
import AqiMapLegend from './AqiMapLegend'
import NoiseMapLegend from './NoiseMapLegend'
import GviMapLegend from './GviMapLegend'
import { Basemap } from '../../constants'
import { ReduxState } from '../../types'
import { ExposureMode } from '../../services/paths'
import ServiceWorkerWrapper from '../ServiceWorkerWrapper'

const VisiblePanel = styled.div`
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.06);
  pointer-events: auto;
`
const LogoRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 13px;
  padding: 6px 4px 0px 9px;
  @media (min-width: 600px) {
    justify-content: flex-start;
    font-size: 14px;
    font-weight: 450;
    padding-bottom: 2px;
  }
  @media (min-width: 1100px) {
    margin-bottom: -20px;
  }
`
const LogoImg = styled.img`
  @media (min-width: 600px) {
    width: 20px;
    height: auto;
  }
`
const GreenPathsLabel = styled.div`
  margin-left: 3px;
  letter-spacing: -0.6px;
`
const LowerTransparentPanel = styled.div`
  position: relative;
`
const LowerWidePanel = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
`
const LowerLeftPanel = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
const LowerRightPanel = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const showAqiMapLegend = (props: PropsFromRedux): boolean => {
  return (
    props.basemap === Basemap.AIR_QUALITY ||
    (props.showingPathsOfExposureMode === ExposureMode.CLEAN &&
      (props.basemap === Basemap.STREETS || props.basemap === Basemap.SATELLITE))
  )
}

const showNoiseMapLegend = (props: PropsFromRedux): boolean => {
  return (
    props.basemap === Basemap.NOISE ||
    (props.showingPathsOfExposureMode === ExposureMode.QUIET &&
      (props.basemap === Basemap.STREETS || props.basemap === Basemap.SATELLITE))
  )
}

const showGviMapLegend = (props: PropsFromRedux): boolean => {
  return (
    props.basemap === Basemap.GVI ||
    (props.showingPathsOfExposureMode === ExposureMode.GREEN &&
      (props.basemap === Basemap.STREETS || props.basemap === Basemap.SATELLITE))
  )
}

const TopPanel = (props: PropsFromRedux) => {
  return (
    <div>
      <VisiblePanel>
        <LogoRow>
          <LogoImg src={Favicon} width="15" height="15" alt="Green Paths app logo" />
          <GreenPathsLabel>
            Green<span style={{ marginLeft: '2px' }}>Paths</span>
          </GreenPathsLabel>
        </LogoRow>
        {!props.odPanelHidden && <OrigDestPanel />}
        <RoutingSettingsRow />
      </VisiblePanel>
      <LowerTransparentPanel>
        <LowerLeftPanel>
          {showAqiMapLegend(props) && <AqiMapLegend />}
          {showNoiseMapLegend(props) && <NoiseMapLegend />}
          {showGviMapLegend(props) && <GviMapLegend />}
        </LowerLeftPanel>
        <LowerRightPanel>
          <ShowInfoButton />
          <BasemapSelector />
        </LowerRightPanel>
        <LowerWidePanel>
          <ServiceWorkerWrapper />
        </LowerWidePanel>
      </LowerTransparentPanel>
    </div>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  basemap: state.map.basemap,
  odPanelHidden: state.ui.odPanelHidden,
  showingPathsOfExposureMode: state.paths.showingPathsOfExposureMode,
})

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(TopPanel)

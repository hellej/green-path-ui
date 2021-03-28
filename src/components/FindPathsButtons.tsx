import React from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { routeEnvOptimizedPaths } from '../reducers/pathsReducer'
import T from './../utils/translator/Translator'
import { ReduxState } from '../types'
import { ExposureMode } from '../services/paths'

const OuterFlex = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 0 10px 13px 10px;
  align-items: center;
  @media (min-width: 550px) {
    flex-direction: row;
    justify-content: center;
  }
`
const Button = styled.button`
  cursor: pointer;
  color: white;
  padding: 7px 18px !important;
  border-radius: 70px !important;
  margin: 5px 6px !important;
  font-weight: 400 !important;
  text-align: center !important;
  width: max-content !important;
  letter-spacing: 0.4 !important;
  font-size: 28px;
  max-width: 90%;
  pointer-events: auto;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.22), 0 6px 20px 0 rgba(0, 0, 0, 0.14);
  background-color: #0eb139;
  color: white;
  &:hover {
    background-color: #0fb93d;
    border: 2px solid rgba(255, 255, 255, 0.95);
  }
  @media (max-width: 620px) {
    font-size: 26px;
  }
`
const Tooltip = styled.div`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
`

const FindPathsButtons = (props: PropsFromRedux) => {
  const {
    cleanPathsAvailable,
    origin,
    destination,
    travelMode,
    routingId,
    waitingPaths,
    showingPaths,
    routeEnvOptimizedPaths,
  } = props

  const { originObject } = origin
  const { destObject } = destination

  const odUnset =
    (!originObject && origin.originInputText.length < 2) ||
    (!destObject && destination.destInputText.length < 2)

  if (odUnset || showingPaths || waitingPaths || origin.error || destination.error) {
    return null
  }

  return (
    <OuterFlex>
      <Button
        onClick={() =>
          routeEnvOptimizedPaths(origin, destination, travelMode, ExposureMode.GREEN, routingId)
        }
      >
        <T>find_green_paths_btn</T>
        <Tooltip>
          <T>find_green_paths_btn.tooltip</T>
        </Tooltip>
      </Button>
      <Button
        onClick={() =>
          routeEnvOptimizedPaths(origin, destination, travelMode, ExposureMode.QUIET, routingId)
        }
      >
        <T>find_quiet_paths_btn</T>
        <Tooltip>
          <T>find_quiet_paths_btn.tooltip</T>
        </Tooltip>
      </Button>
      {cleanPathsAvailable ? (
        <Button
          onClick={() =>
            routeEnvOptimizedPaths(origin, destination, travelMode, ExposureMode.CLEAN, routingId)
          }
        >
          <T>find_fresh_air_paths_btn</T>
          <Tooltip>
            <T>find_fresh_air_paths_btn.tooltip</T>
          </Tooltip>
        </Button>
      ) : null}
    </OuterFlex>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  origin: state.origin,
  destination: state.destination,
  travelMode: state.paths.travelMode,
  waitingPaths: state.paths.waitingPaths,
  showingPaths: state.paths.showingPaths,
  routingId: state.paths.routingId,
  cleanPathsAvailable: state.paths.cleanPathsAvailable,
})

const connector = connect(mapStateToProps, { routeEnvOptimizedPaths })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(FindPathsButtons)

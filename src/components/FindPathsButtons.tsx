import React from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { getSetCleanPaths, getSetQuietPaths } from '../reducers/pathsReducer'
import T from './../utils/translator/Translator'
import { ReduxState } from '../types'

const OuterFlex = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10px 13px 10px;
  align-items: center;
  @media (min-width: 550px) {
    flex-direction: row;
    justify-content: center;
  }
`
const Button = styled.div`
  cursor: pointer;
  padding: 7px 18px;
  color: white;
  border-radius: 70px;
  margin: 5px 6px;
  font-weight: 400;
  font-size: 28px;
  text-align: center;
  width: max-content;
  letter-spacing: 0.4;
  max-width: 90%;
  overflow: auto;
  height: auto;
  pointer-events: auto;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.22), 0 6px 20px 0 rgba(0, 0, 0, 0.14);
  background-color: #10a538ed;
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
    selectedTravelMode,
    routingId,
    waitingPaths,
    showingPaths,
    getSetCleanPaths,
    getSetQuietPaths,
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
      <Button onClick={() => getSetQuietPaths(origin, destination, selectedTravelMode, routingId)}>
        <T>find_quiet_paths_btn</T>
        <Tooltip>
          <T>find_quiet_paths_btn.tooltip</T>
        </Tooltip>
      </Button>
      {cleanPathsAvailable ? (
        <Button
          onClick={() => getSetCleanPaths(origin, destination, selectedTravelMode, routingId)}
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
  selectedTravelMode: state.paths.selectedTravelMode,
  waitingPaths: state.paths.waitingPaths,
  showingPaths: state.paths.showingPaths,
  routingId: state.paths.routingId,
  cleanPathsAvailable: state.paths.cleanPathsAvailable,
})

const connector = connect(mapStateToProps, { getSetCleanPaths, getSetQuietPaths })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(FindPathsButtons)

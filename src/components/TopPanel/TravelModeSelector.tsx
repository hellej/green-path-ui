import React from 'react'
import styled, { css } from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { MdDirectionsBike } from 'react-icons/md'
import { MdDirectionsWalk } from 'react-icons/md'
import { setTravelMode, routeEnvOptimizedPaths } from './../../reducers/pathsReducer'
import { ReduxState } from '../../types'
import { ExposureMode, TravelMode } from '../../services/paths'

const StyledBikeI = styled(MdDirectionsBike)`
  font-size: 23px;
  margin-top: 3px;
  margin-bottom: -2px;
  vertical-align: middle;
  display: table-cell;
  text-align: center;
`
const StyledWalkI = styled(MdDirectionsWalk)`
  font-size: 23px;
  margin-top: 2px;
  margin-bottom: -1px;
  vertical-align: middle;
  display: table-cell;
  text-align: center;
`
const ButtonRow = styled.div`
  display: flex;
  align-content: center;
  margin: 2px 4px;
`
const StyledIconContainer = styled.div<{ bike?: any; selected: boolean }>`
  cursor: pointer;
  pointer-events: auto;
  display: flex;
  margin: 2px 4px;
  padding: 2px 10px;
  border-radius: 25px;
  height: 28px;
  width: 32px;
  align-content: center;
  justify-content: center;
  background: #f5f5f5c4;
  border: 1px solid #f5f5f5c4;
  transition-duration: 0.15s;
  -webkit-transition-duration: 0.15s; /* Safari */
  @media (min-width: 550px) {
    &:hover {
      border-color: black;
    }
  }
  ${props =>
    props.selected === true &&
    css`
      background: #eaf8ff;
      border-color: #65a1bd;
      pointer-events: none;
      &:hover {
        border-color: #65a1bd;
      }
    `}
`

const getSetTravelModeFunction = (props: PropsFromRedux, travelModeOfTheButton: TravelMode) => {
  if (props.waitingPaths) {
    return null
  }
  if (!props.showingPathsOfExposureMode) {
    return props.setTravelMode(travelModeOfTheButton)
  } else {
    const { origin, destination } = props
    if (props.showingPathsOfExposureMode === ExposureMode.QUIET) {
      return props.routeEnvOptimizedPaths(
        origin,
        destination,
        travelModeOfTheButton,
        props.showingPathsOfExposureMode,
        props.routingId,
      )
    } else {
      return props.routeEnvOptimizedPaths(
        origin,
        destination,
        travelModeOfTheButton,
        props.showingPathsOfExposureMode,
        props.routingId,
      )
    }
  }
}

const TravelModeSelector = (props: PropsFromRedux) => {
  return (
    <ButtonRow>
      <StyledIconContainer
        data-cy="toggle-to-walk-button"
        onClick={() => getSetTravelModeFunction(props, TravelMode.WALK)}
        selected={props.travelMode === TravelMode.WALK}
      >
        <StyledWalkI />
      </StyledIconContainer>
      <StyledIconContainer
        data-cy="toggle-to-bike-button"
        onClick={() => getSetTravelModeFunction(props, TravelMode.BIKE)}
        selected={props.travelMode === TravelMode.BIKE}
        bike
      >
        <StyledBikeI />
      </StyledIconContainer>
    </ButtonRow>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  showingPaths: state.paths.showingPaths,
  waitingPaths: state.paths.waitingPaths,
  travelMode: state.paths.travelMode,
  showingPathsOfExposureMode: state.paths.showingPathsOfExposureMode,
  origin: state.origin,
  destination: state.destination,
  routingId: state.paths.routingId,
})

const connector = connect(mapStateToProps, { setTravelMode, routeEnvOptimizedPaths })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(TravelModeSelector)

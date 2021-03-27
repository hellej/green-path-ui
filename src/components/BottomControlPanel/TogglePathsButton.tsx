import React from 'react'
import styled, { css } from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { routeEnvOptimizedPaths } from '../../reducers/pathsReducer'
import T from './../../utils/translator/Translator'
import { EnvExposureMode, ReduxState } from '../../types'
import { ExposureMode } from '../../services/paths'

const Button = styled.div`
  cursor: pointer;
  padding: 5px 11px;
  color: white;
  border-radius: 30px;
  margin: 0px;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  width: max-content;
  letter-spacing: 1px;
  max-width: 90%;
  overflow: auto;
  height: auto;
  pointer-events: auto;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  background-color: #2d2d2d;
  @media (min-width: 600px) {
    &:hover {
      margin-bottom: 3px;
    }
  }
`

interface LabelProps {
  toggleToExposureMode: ExposureMode
}

const StyledPathTypeLabel = styled.span<LabelProps>`
  color: green;
  ${props =>
    props.toggleToExposureMode === ExposureMode.QUIET &&
    css`
      color: #6ff7ff;
    `}
  ${props =>
    props.toggleToExposureMode === ExposureMode.GREEN &&
    css`
      color: #74ff74;
    `}
  ${props =>
    props.toggleToExposureMode === ExposureMode.CLEAN &&
    css`
      color: #c3ffe6;
    `}
`

const getToggleToExposureMode = (
  showingPathsOfExposureMode: EnvExposureMode,
  cleanPathsAvailable: boolean,
): EnvExposureMode => {
  if (showingPathsOfExposureMode === ExposureMode.GREEN) {
    return ExposureMode.QUIET
  }
  if (showingPathsOfExposureMode === ExposureMode.QUIET && cleanPathsAvailable) {
    return ExposureMode.CLEAN
  }
  return ExposureMode.GREEN
}

const buttonLabelByExposureMode: Record<EnvExposureMode, string> = {
  [ExposureMode.GREEN]: 'toggle_paths_exposure.label.green',
  [ExposureMode.QUIET]: 'toggle_paths_exposure.label.quiet',
  [ExposureMode.CLEAN]: 'toggle_paths_exposure.label.fresh_air',
}

const getPathToggleFunc = (toggleToPathType: EnvExposureMode, props: PropsFromRedux) => {
  const { routeEnvOptimizedPaths, travelMode, origin, destination, routingId } = props
  return routeEnvOptimizedPaths(origin, destination, travelMode, toggleToPathType, routingId)
}

const TogglePathsButton = (props: PropsFromRedux) => {
  const { cleanPathsAvailable, showingPathsOfExposureMode } = props
  const toggleToExposureMode = getToggleToExposureMode(
    showingPathsOfExposureMode!,
    cleanPathsAvailable,
  )
  const toggleLabel = buttonLabelByExposureMode[toggleToExposureMode]
  return (
    <Button
      data-cy="toggle-paths-exposure"
      onClick={() => getPathToggleFunc(toggleToExposureMode, props)}
    >
      <T>toggle_paths_exposure.label.show</T>
      <StyledPathTypeLabel toggleToExposureMode={toggleToExposureMode}>
        {' '}
        <T>{toggleLabel}</T>{' '}
      </StyledPathTypeLabel>
      {toggleToExposureMode === ExposureMode.CLEAN && (
        <T>toggle_paths_exposure.label.(fresh_air).paths</T>
      )}
      {(toggleToExposureMode === ExposureMode.QUIET ||
        toggleToExposureMode === ExposureMode.GREEN) && <T>toggle_paths_exposure.label.paths</T>}
    </Button>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  cleanPathsAvailable: state.paths.cleanPathsAvailable,
  routingId: state.paths.routingId,
  travelMode: state.paths.travelMode,
  showingPathsOfExposureMode: state.paths.showingPathsOfExposureMode,
  origin: state.origin,
  destination: state.destination,
})

const connector = connect(mapStateToProps, { routeEnvOptimizedPaths })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(TogglePathsButton)

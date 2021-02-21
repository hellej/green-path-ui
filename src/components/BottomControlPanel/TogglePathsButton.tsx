import React from 'react'
import styled, { css } from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { getSetQuietPaths, getSetCleanPaths, setQuietPaths, setCleanPaths } from '../../reducers/pathsReducer'
import { ExposureMode } from '../../constants'
import T from './../../utils/translator/Translator'

const Button = styled.div<{ disabled: boolean }>`
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
  ${props => props.disabled === true && css`
    cursor: default;
    pointer-events: none;
    background-color: #d2d2d2;
  `}
`

interface LabelProps {
  disabled: boolean
  toggleToPathType: ExposureMode
}

const StyledPathTypeLabel = styled.span<LabelProps>`
  color: green;
  ${props => props.toggleToPathType === ExposureMode.QUIET && css`
    color: #6ff7ff;
    `}
  ${props => props.toggleToPathType === ExposureMode.CLEAN && css`
    color: #74ff74;
    `}
  ${props => props.disabled === true && css`
    color: white;
  `}
`

const getPathToggleFunc = (toggleToPathType: ExposureMode, props: PropsFromRedux) => {
  const {
    selectedTravelMode,
    origin,
    destination,
    routingId
  } = props
  const { getSetQuietPaths, getSetCleanPaths } = props
  return toggleToPathType === ExposureMode.QUIET
    ? getSetQuietPaths(origin, destination, selectedTravelMode, routingId)
    : getSetCleanPaths(origin, destination, selectedTravelMode, routingId)
}

const TogglePathsButton = (props: PropsFromRedux) => {
  const { cleanPathsAvailable, showingPathsOfExposureMode } = props
  const toggleToPathType = showingPathsOfExposureMode === ExposureMode.CLEAN ? ExposureMode.QUIET : ExposureMode.CLEAN
  const disabled = !cleanPathsAvailable && showingPathsOfExposureMode === ExposureMode.QUIET
  const toggleLabel = toggleToPathType === ExposureMode.QUIET
    ? 'toggle_paths_exposure.label.quiet'
    : 'toggle_paths_exposure.label.fresh_air'
  return (
    <Button disabled={disabled} data-cy="toggle-paths-exposure"
      onClick={() => getPathToggleFunc(toggleToPathType, props)}>
      <T>toggle_paths_exposure.label.show</T>
      <StyledPathTypeLabel disabled={disabled} toggleToPathType={toggleToPathType}>
        {' '}<T>{toggleLabel}</T>{' '}
      </StyledPathTypeLabel>
      {toggleToPathType === ExposureMode.CLEAN && <T>toggle_paths_exposure.label.(fresh_air).paths</T>}
      {toggleToPathType === ExposureMode.QUIET && <T>toggle_paths_exposure.label.(quiet).paths</T>}
    </Button>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  cleanPathsAvailable: state.paths.cleanPathsAvailable,
  routingId: state.paths.routingId,
  selectedTravelMode: state.paths.selectedTravelMode,
  showingPathsOfExposureMode: state.paths.showingPathsOfExposureMode,
  origin: state.origin,
  destination: state.destination
})

const mapDispatchToProps = {
  getSetQuietPaths,
  getSetCleanPaths,
  setQuietPaths,
  setCleanPaths,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(TogglePathsButton)

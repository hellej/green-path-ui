import React from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { menu, ExposureMode } from './../../constants'
import FilterButton from './FilterButton'
import { ListButton } from './../Icons'
import ToggleBottomPanelButton from './ToggleBottomPanelButton'
import TogglePathsButton from './TogglePathsButton'
import {
  togglePathPanel,
  showPathList,
  showMaxLengthFilterSelector,
} from './../../reducers/uiReducer'

const ControlPanel = styled.div<{ pathPanelVisible: boolean }>`
  background: rgba(255, 255, 255, 0.98);
  height: 53px;
  margin-left: 0px;
  display: flex;
  pointer-events: auto;
  box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.07), 0 -6px 20px 0 rgba(0, 0, 0, 0.04);
  border: 1px solid #d0d0d0;
  border-top-right-radius: ${props => (props.pathPanelVisible === true ? '0px' : '6px')};
  @media (min-width: 600px) {
    width: 380px;
    padding: 0px 6px 0px 6px;
    border: none;
  }
`
const ButtonFlex = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`

const BottomControlPanel = (props: propsFromRedux) => {
  const {
    showingPaths,
    showingPathsOfExposureMode,
    pathPanelVisible,
    pathPanelContent,
    quietPathCount,
    cleanPathCount,
    lengthLimit,
    lengthLimits,
    togglePathPanel,
    showPathList,
    showMaxLengthFilterSelector,
  } = props

  if (!showingPaths) return null

  const greenPathCount =
    showingPathsOfExposureMode === ExposureMode.CLEAN ? cleanPathCount : quietPathCount

  return (
    <ControlPanel pathPanelVisible={pathPanelVisible}>
      <ButtonFlex>
        {pathPanelContent === menu.lengthLimitSelector ? (
          <ListButton onClick={showPathList} />
        ) : (
          <FilterButton
            greenPathCount={greenPathCount}
            lengthLimit={lengthLimit}
            lengthLimits={lengthLimits}
            onClick={showMaxLengthFilterSelector}
          />
        )}
        <ToggleBottomPanelButton
          up={!pathPanelVisible}
          onClick={togglePathPanel}
        ></ToggleBottomPanelButton>
        <TogglePathsButton />
      </ButtonFlex>
    </ControlPanel>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  showingPaths: state.paths.showingPaths,
  showingPathsOfExposureMode: state.paths.showingPathsOfExposureMode,
  pathPanelVisible: state.ui.pathPanel,
  pathPanelContent: state.ui.pathPanelContent,
  quietPathCount: state.paths.quietPathFC.features.length,
  cleanPathCount: state.paths.cleanPathFC.features.length,
  lengthLimit: state.paths.lengthLimit,
  lengthLimits: state.paths.lengthLimits,
})

const connector = connect(mapStateToProps, {
  togglePathPanel,
  showPathList,
  showMaxLengthFilterSelector,
})
type propsFromRedux = ConnectedProps<typeof connector>
export default connector(BottomControlPanel)

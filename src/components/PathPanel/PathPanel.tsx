import React from 'react'
import styled, { css } from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { menu } from './../../constants'
import { setLengthLimit } from './../../reducers/pathsReducer'
import { showPathList } from './../../reducers/uiReducer'
import MaxLengthFilterSelector from './MaxLengthFilterSelector'
import PathInfoPanel from './PathInfoPanel'
import LoadAnimation from './../LoadAnimation/LoadAnimation'

const PathPanelContainer = styled.div<{ showingOpenedPath?: boolean }>`
  margin: 0px;
  background: rgba(255, 255, 255, 0.95);
  overflow: auto;
  width: auto;
  max-height: 184px;
  pointer-events: auto;
  padding: 6px 6px 3px 6px;
  box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.07), 0 -6px 20px 0 rgba(0, 0, 0, 0.04);
  @media (min-width: 600px) {
    width: 380px;
    max-height: calc(100vh - 121px);
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }
  ${props =>
    props.showingOpenedPath === true &&
    css`
      max-height: calc(100vh - 121px);
      height: min-content;
    `}
`
const LoadAnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0px 20px 0px;
`

const PathPanel = (props: PropsFromRedux) => {
  const { paths, pathPanelVisible, pathPanelContent } = props
  const { setLengthLimit, showPathList } = props
  const { waitingPaths, showingPaths, openedPath, lengthLimit, lengthLimits } = paths

  if (waitingPaths) {
    return (
      <PathPanelContainer>
        <LoadAnimationContainer>
          <LoadAnimation size={57} />
        </LoadAnimationContainer>
      </PathPanelContainer>
    )
  }

  if (!showingPaths || !pathPanelVisible) return null

  const showingOpenedPath = openedPath !== null && !(pathPanelContent === menu.lengthLimitSelector)

  return (
    <PathPanelContainer data-cy="path-panel-container" showingOpenedPath={showingOpenedPath}>
      {pathPanelContent === menu.lengthLimitSelector ? (
        <MaxLengthFilterSelector
          lengthLimit={lengthLimit}
          lengthLimits={lengthLimits}
          setLengthLimit={setLengthLimit}
          showPathList={showPathList}
        />
      ) : null}
      <PathInfoPanel />
    </PathPanelContainer>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  paths: state.paths,
  scrollToPath: state.pathList.scrollToPath,
  pathPanelVisible: state.ui.pathPanel,
  pathPanelContent: state.ui.pathPanelContent,
})

const mapDispatchToProps = {
  setLengthLimit,
  showPathList,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(PathPanel)

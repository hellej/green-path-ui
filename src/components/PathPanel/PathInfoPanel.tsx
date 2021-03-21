import React, { Fragment } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { menu } from '../../constants'
import PathList from './PathList/PathList'
import OpenedPathInfo from './OpenedPathInfo/OpenedPathInfo'

const PathInfoPanel = (props: PropsFromRedux) => {
  const { openedPath, pathPanelContent } = props
  const showingPathList = pathPanelContent === menu.pathList && !openedPath
  const showingOpenedPath = openedPath && !(pathPanelContent === menu.lengthLimitSelector)

  return (
    <Fragment>
      {showingPathList && <PathList />}
      {showingOpenedPath && <OpenedPathInfo />}
    </Fragment>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  openedPath: state.paths.openedPath,
  pathPanelContent: state.ui.pathPanelContent,
})

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(PathInfoPanel)

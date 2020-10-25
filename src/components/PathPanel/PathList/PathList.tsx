import React, { createRef, RefObject } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import { ExposureMode } from '../../../constants'
import { OpenPathBox } from './../OpenClosePathBoxes'
import { setSelectedPath, setOpenedPath } from '../../../reducers/pathsReducer'
import PathListPathBox, { ShortestPathBox } from './PathListPathBox'

const PathRowFlex = styled.div`
  display: flex;
  justify-content: space-around;
`

type State = {
  linkVisible: boolean,
  pathRefs: { [key: string]: RefObject<any> }
}

class PathList extends React.Component<PropsFromRedux, State> {

  constructor(props: PropsFromRedux) {
    super(props)
    this.state = {
      linkVisible: true,
      pathRefs: { 'short': createRef() },
    }
  }

  componentDidUpdate(prevProps: PropsFromRedux) {
    const { quietPathFC, cleanPathFC, showingPathsOfExposureMode } = this.props.paths
    let pathRefs = this.state.pathRefs
    let updateRefs = false

    const greenPathFC = showingPathsOfExposureMode === ExposureMode.CLEAN
      ? cleanPathFC
      : quietPathFC

    for (let feat of greenPathFC.features) {
      if (!(feat.properties.id in pathRefs)) {
        pathRefs[feat.properties.id] = createRef()
        updateRefs = true
      }
    }
    if (updateRefs) {
      this.setState({ pathRefs })
    }
    if (prevProps.scrollToPath !== this.props.scrollToPath) {
      this.state.pathRefs[this.props.scrollToPath].current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      })
    }
  }

  openPathDisabled = (showingPathsOfExposureMode: ExposureMode, pathProps: PathProperties): boolean => {
    if (showingPathsOfExposureMode === ExposureMode.CLEAN) {
      return pathProps.missing_aqi
    }
    if (showingPathsOfExposureMode === ExposureMode.QUIET) {
      return pathProps.missing_noises
    }
    return false
  }

  render() {
    const { paths, setSelectedPath, setOpenedPath } = this.props
    const { showingPathsOfExposureMode, showingPathsOfTravelMode, showingStatsType, shortPathFC, cleanPathFC, quietPathFC, selPathFC, lengthLimit } = paths
    const selPathId = selPathFC.features.length > 0
      ? selPathFC.features[0].properties.id
      : 'none'

    const greenPathFC = showingPathsOfExposureMode === ExposureMode.CLEAN
      ? cleanPathFC
      : quietPathFC

    const shortPath = shortPathFC.features[0]
    const greenPaths = greenPathFC.features.filter(path => path.properties.length <= lengthLimit.limit)

    return (
      <div>
        <PathRowFlex ref={this.state.pathRefs[shortPath.properties.id]}>
          <ShortestPathBox
            path={shortPath}
            handleClick={() => setSelectedPath(shortPath.properties.id)}
            showingPathsOfExposureMode={showingPathsOfExposureMode!}
            travelMode={showingPathsOfTravelMode!}
            showingStatsType={showingStatsType!}
            selected={shortPath.properties.id === selPathId} />
          <OpenPathBox
            disabled={this.openPathDisabled(showingPathsOfExposureMode!, shortPath.properties)}
            handleClick={() => setOpenedPath(shortPath)} />
        </PathRowFlex>
        {greenPaths.map((path) => (
          <PathRowFlex key={path.properties.id} ref={this.state.pathRefs[path.properties.id]}>
            <PathListPathBox
              path={path}
              showingPathsOfExposureMode={showingPathsOfExposureMode!}
              travelMode={showingPathsOfTravelMode!}
              showingStatsType={showingStatsType!}
              handleClick={() => setSelectedPath(path.properties.id)}
              selected={path.properties.id === selPathId} />
            <OpenPathBox
              disabled={this.openPathDisabled(showingPathsOfExposureMode!, shortPath.properties)}
              handleClick={() => setOpenedPath(path)} />
          </PathRowFlex>
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  paths: state.paths,
  scrollToPath: state.pathList.scrollToPath,
})

const mapDispatchToProps = {
  setSelectedPath,
  setOpenedPath
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(PathList)
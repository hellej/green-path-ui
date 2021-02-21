import React, { createRef, Fragment, RefObject } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import { ExposureMode } from '../../../constants'
import { setSelectedPath, setOpenedPath } from '../../../reducers/pathsReducer'
import CarTripInfo from './CarTripInfo'
import PathListPathBox from './PathListPathBox'

const PathRowFlex = styled.div`
  display: flex;
  justify-content: space-around;
`

type State = {
  linkVisible: boolean
  pathRefs: { [key: string]: RefObject<any> }
}

class PathList extends React.Component<PropsFromRedux, State> {
  constructor(props: PropsFromRedux) {
    super(props)
    this.state = {
      linkVisible: true,
      pathRefs: { short: createRef() },
    }
  }

  componentDidUpdate(prevProps: PropsFromRedux) {
    const { quietPathFC, cleanPathFC, showingPathsOfExposureMode } = this.props.paths
    let pathRefs = this.state.pathRefs
    let updateRefs = false

    const greenPathFC =
      showingPathsOfExposureMode === ExposureMode.CLEAN ? cleanPathFC : quietPathFC

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

  render() {
    const { paths, setSelectedPath, setOpenedPath } = this.props
    const {
      showingPathsOfExposureMode,
      showingPathsOfTravelMode,
      shortPathFC,
      cleanPathFC,
      quietPathFC,
      selPathFC,
      lengthLimit,
    } = paths

    const selPathId = selPathFC.features.length > 0 ? selPathFC.features[0].properties.id : 'none'

    const greenPathFC =
      showingPathsOfExposureMode === ExposureMode.CLEAN ? cleanPathFC : quietPathFC

    const shortPath = shortPathFC.features[0]
    const greenPaths = greenPathFC.features.filter(
      (path) => path.properties.length <= lengthLimit.limit,
    )

    return (
      <Fragment>
        <PathRowFlex data-cy="shortest-path-box" ref={this.state.pathRefs[shortPath.properties.id]}>
          <PathListPathBox
            path={shortPath}
            travelMode={showingPathsOfTravelMode!}
            showingPathsOfExposureMode={showingPathsOfExposureMode!}
            handleClick={() => setSelectedPath(shortPath.properties.id)}
            selected={shortPath.properties.id === selPathId}
            setOpenedPath={() => setOpenedPath(shortPath)}
          />
        </PathRowFlex>
        {greenPaths.map((path) => (
          <PathRowFlex
            data-cy="green-path-box"
            key={path.properties.id}
            ref={this.state.pathRefs[path.properties.id]}
          >
            <PathListPathBox
              path={path}
              travelMode={showingPathsOfTravelMode!}
              showingPathsOfExposureMode={showingPathsOfExposureMode!}
              handleClick={() => setSelectedPath(path.properties.id)}
              selected={path.properties.id === selPathId}
              setOpenedPath={() => setOpenedPath(shortPath)}
            />
          </PathRowFlex>
        ))}
        <CarTripInfo />
      </Fragment>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  paths: state.paths,
  scrollToPath: state.pathList.scrollToPath,
})

const mapDispatchToProps = {
  setSelectedPath,
  setOpenedPath,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(PathList)

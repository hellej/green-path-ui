import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import { unsetOpenedPath } from '../../../reducers/pathsReducer'
import { PathNoisesBar } from './../PathNoisesBar'
import { PathAqiBar } from './../PathAqiBar'
import { OpenedPathNoiseExps } from './OpenedPathNoiseExps'
import { OpenedPathAqExps } from './OpenedPathAqExps'
import { ClosePathBox } from './../OpenClosePathBoxes'
import T from './../../../utils/translator/Translator'
import { PathFeature, ReduxState } from '../../../types'
import { ExposureMode, TravelMode } from '../../../services/paths'

const PathRowFlex = styled.div`
  display: flex;
  justify-content: space-around;
`
const ExposureBarsFlex = styled.div`
  display: flex;
  width: calc(90% - 21px);
  min-height: 56px;
  flex-direction: column;
  justify-content: space-around;
  margin: 3px 0px 1px 0px;
`
const BarsLabel = styled.div`
  font-size: 14px;
  margin: 1px 0px 5px 0px;
`

const OpenedPathInfo = ({ paths, unsetOpenedPath }: PropsFromRedux) => {
  const { shortPathFC, openedPath, showingStatsType, showingPathsOfTravelMode } = paths
  const openedIsShortest = openedPath!.properties.type === ExposureMode.SHORT
  const shortPath = shortPathFC.features[0]

  switch (showingStatsType) {
    case ExposureMode.GREEN: {
      return <div>GVI INFO (TODO)</div>
    }
    case ExposureMode.CLEAN: {
      return (
        <PathAqiExposures
          openedIsShortest={openedIsShortest}
          path={openedPath!}
          shortPath={openedIsShortest ? null : shortPath}
          travelMode={showingPathsOfTravelMode!}
          unsetOpenedPath={unsetOpenedPath}
        />
      )
    }
    case ExposureMode.QUIET: {
      return (
        <PathNoiseExposures
          openedIsShortest={openedIsShortest}
          path={openedPath!}
          shortPath={openedIsShortest ? null : shortPath}
          travelMode={showingPathsOfTravelMode!}
          unsetOpenedPath={unsetOpenedPath}
        />
      )
    }
    default:
      return null
  }
}

interface PathExposureProps {
  openedIsShortest: boolean
  path: PathFeature
  shortPath: PathFeature | null
  travelMode: TravelMode
  unsetOpenedPath: React.MouseEventHandler<HTMLElement>
}

const PathAqiExposures = ({
  openedIsShortest,
  path,
  shortPath,
  travelMode,
  unsetOpenedPath,
}: PathExposureProps) => {
  return (
    <div>
      <PathRowFlex>
        <ClosePathBox handleClick={unsetOpenedPath} />
        <ExposureBarsFlex>
          <BarsLabel>
            <T>
              {openedIsShortest
                ? 'opened_shortest_clean_path.tooltip'
                : 'opened_clean_path.tooltip'}
            </T>
          </BarsLabel>
          <PathAqiBar withMargins={true} aqiPcts={path.properties.aqi_cl_pcts} />
          {!openedIsShortest && shortPath && (
            <PathAqiBar withMargins={true} aqiPcts={shortPath.properties.aqi_cl_pcts} />
          )}
        </ExposureBarsFlex>
      </PathRowFlex>
      <OpenedPathAqExps path={path} travelMode={travelMode} />
    </div>
  )
}

const PathNoiseExposures = ({
  openedIsShortest,
  path,
  shortPath,
  travelMode,
  unsetOpenedPath,
}: PathExposureProps) => {
  return (
    <div>
      <PathRowFlex>
        <ClosePathBox handleClick={unsetOpenedPath} />
        <ExposureBarsFlex>
          <BarsLabel>
            <T>
              {openedIsShortest
                ? 'opened_shortest_quiet_path.tooltip'
                : 'opened_quiet_path.tooltip'}
            </T>
          </BarsLabel>
          <PathNoisesBar withMargins={true} noisePcts={path.properties.noise_pcts} />
          {!openedIsShortest && shortPath && (
            <PathNoisesBar withMargins={true} noisePcts={shortPath.properties.noise_pcts} />
          )}
        </ExposureBarsFlex>
      </PathRowFlex>
      <OpenedPathNoiseExps path={path} travelMode={travelMode} />
    </div>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  paths: state.paths,
})

const mapDispatchToProps = {
  unsetOpenedPath,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(OpenedPathInfo)

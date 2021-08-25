import React from 'react'
import styled from 'styled-components'
import { utils } from '../../../utils/index'
import ExposureScoreBar from './../ExposureScoreBar'
import { OpenPathBox } from '../OpenClosePathBoxes'
import { PathFeature, PathProperties } from '../../../types'
import { ExposureMode, TravelMode } from '../../../services/paths'

type PathBoxProps = {
  selected: boolean
  children: any
}
const StyledPathListPathBox = styled.div.attrs((props: PathBoxProps) => ({
  style: {
    border: props.selected ? '2px solid black' : '',
    boxShadow: props.selected
      ? '0 -1px 6px 0 rgba(0, 0, 0, 0.1), 0 3px 4px 0 rgba(0, 0, 0, 0.13)'
      : '',
  },
}))<PathBoxProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  pointer-events: auto;
  border-radius: 5px;
  margin: 4px 0px 4px 0px;
  background-color: white;
  border: 2px solid transparent;
  padding: 9px 4px;
  color: black;
  cursor: default;
  transition-duration: 0.12s;
  box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.1), 0 3px 4px 0 rgba(0, 0, 0, 0.13);
  width: 100%;
  @media (max-width: 360px) {
    width: calc(100% - 8px);
  }
  @media (min-width: 600px) {
    &:hover {
      cursor: pointer;
      box-shadow: 0 -1px 6px 1px rgba(0, 0, 0, 0.12), 0 3px 6px 1px rgba(0, 0, 0, 0.18);
    }
  }
`
const TripInfo = styled.div`
  margin: 0 7px 0 4px;
  display: flex;
  width: 48px;
  align-content: flex-end;
  flex-direction: column;
  text-align: right;
  @media (max-width: 350px) {
    margin: 0 4px 0 3px;
  }
`
const TravelTime = styled.div`
  font-size: 13px;
  color: black;
  margin-bottom: 3px;
  @media (max-width: 350px) {
    line-height: 100%;
  }
`
const Distance = styled.div`
  font-size: 11px;
  color: grey;
`
const MetersContainer = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  width: calc(100% - 48px);
`
const MeterWrapper = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  margin: 2px 10px;
  @media (max-width: 350px) {
    margin: 2px 9px;
  }
`
const OpenPathInfoWrapper = styled.div`
  margin: 0 7px 0 7px;
  display: flex;
  width: 30px;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 350px) {
    margin: 0 2px 0 5px;
  }
`

const roundTo = (number: number, digits: number): number => {
  return Math.round(number * (10 * digits)) / (10 * digits)
}

const getFormattedDistanceString = (m: number): string => {
  let distance
  let unit
  if (Math.abs(m) >= 950) {
    const km = m / 1000
    distance = roundTo(km, 1)
    unit = ' km'
  } else if (Math.abs(m) > 60) {
    distance = Math.round(m / 10) * 10
    unit = ' m'
  } else {
    distance = Math.round(m)
    unit = ' m'
  }
  return String(distance) + unit
}

const openPathDisabled = (
  showingPathsOfExposureMode: ExposureMode,
  pathProps: PathProperties,
): boolean => {
  if (showingPathsOfExposureMode === ExposureMode.CLEAN) {
    return pathProps.missing_aqi
  }
  if (showingPathsOfExposureMode === ExposureMode.QUIET) {
    return pathProps.missing_noises
  }
  return false
}

interface PathBoxProperties {
  path: PathFeature
  selected: boolean
  travelMode: TravelMode
  showingPathsOfExposureMode: ExposureMode
  handleClick: React.MouseEventHandler<HTMLElement>
  setOpenedPath: React.MouseEventHandler<HTMLElement>
}

const PathListPathBox = ({
  path,
  selected,
  travelMode,
  showingPathsOfExposureMode,
  handleClick,
  setOpenedPath,
}: PathBoxProperties) => {
  const handleSetOpenedPath = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    setOpenedPath(e)
  }

  return (
    <StyledPathListPathBox
      selected={selected}
      data-cy={`path-box-selected-${selected}`}
      onClick={handleClick}
    >
      <TripInfo>
        <TravelTime>
          {utils.formatDuration(utils.getSecsFromModeLengths(path.properties.mode_lengths))}
        </TravelTime>
        <Distance>{getFormattedDistanceString(path.properties.length)}</Distance>
      </TripInfo>
      <MetersContainer>
        {path.properties.greeneryScore && (
          <MeterWrapper>
            <ExposureScoreBar
              expScorePct={path.properties.greeneryScore}
              labelKey={'exposure_score_label.greenery'}
            />
          </MeterWrapper>
        )}
        {path.properties.quietnessScore && (
          <MeterWrapper>
            <ExposureScoreBar
              expScorePct={path.properties.quietnessScore}
              labelKey={'exposure_score_label.quietness'}
            />
          </MeterWrapper>
        )}
        {path.properties.aqScore && (
          <MeterWrapper>
            <ExposureScoreBar
              expScorePct={path.properties.aqScore}
              labelKey={'exposure_score_label.air_quality'}
            />
          </MeterWrapper>
        )}
        <OpenPathInfoWrapper>
          <OpenPathBox
            handleClick={handleSetOpenedPath}
            disabled={openPathDisabled(showingPathsOfExposureMode, path.properties)}
          />
        </OpenPathInfoWrapper>
      </MetersContainer>
    </StyledPathListPathBox>
  )
}

export default PathListPathBox

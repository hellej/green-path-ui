import React from 'react'
import styled from 'styled-components'
import { utils } from '../../../utils/index'
import ExposureScoreBar from './../ExposureScoreBar'
import { ExposureMode, TravelMode } from '../../../constants'

type PathBoxProps = {
  selected: boolean
  children: any
}
const StyledPathListPathBox = styled.div.attrs((props: PathBoxProps) => ({
  style: {
    border: props.selected ? '2px solid black' : '',
    boxShadow: props.selected
      ? '0 -1px 7px 0 rgba(0, 0, 0, 0.15), 0 4px 7px 0 rgba(0, 0, 0, 0.25)'
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
  box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.25), 0 3px 4px 0 rgba(0, 0, 0, 0.3);
  width: 100%;
  &:hover {
    cursor: pointer;
    @media (min-width: 600px) {
      box-shadow: 0 -1px 8px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 0 rgba(0, 0, 0, 0.35);
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
`
const TravelTime = styled.div`
  font-size: 13px;
  color: black;
  margin-bottom: 3px;
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
`
const OpenPathInfoWrapper = styled.div`
  margin: 0 7px 0 7px;
  display: flex;
  width: 30px;
  flex-direction: column;
  justify-content: center;
`
const OpenPathInfoButton = styled.button`
  display: block;
  height: 33px;
  width: 33px;
  border-radius: 50%;
  border: none;
  outline: none;
  font-size: 22px;
  padding: 0px !important; // fix the circle for ios
  box-sizing: border-box; // fix the circle for ios
  white-space: nowrap;
  box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.1), 0 3px 4px 0 rgba(0, 0, 0, 0.13);
  background-color: white;
  &:hover {
    cursor: pointer;
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
  return (
    <StyledPathListPathBox selected={selected} onClick={handleClick}>
      <TripInfo>
        <TravelTime>
          {utils.getDurationStringFromDist(path.properties.length, travelMode)}
        </TravelTime>
        <Distance>{getFormattedDistanceString(path.properties.length)}</Distance>
      </TripInfo>
      <MetersContainer>
        {path.properties.greeneryScore && (
          <MeterWrapper>
            <ExposureScoreBar
              width={path.properties.greeneryScore}
              labelKey={'exposure_score_label.greenery'}
            />
          </MeterWrapper>
        )}
        {path.properties.quietnessScore && (
          <MeterWrapper>
            <ExposureScoreBar
              width={path.properties.quietnessScore}
              labelKey={'exposure_score_label.quietness'}
            />
          </MeterWrapper>
        )}
        {path.properties.aqScore && (
          <MeterWrapper>
            <ExposureScoreBar
              width={path.properties.aqScore}
              labelKey={'exposure_score_label.air_quality'}
            />
          </MeterWrapper>
        )}
        <OpenPathInfoWrapper>
          <OpenPathInfoButton
            onClick={setOpenedPath}
            disabled={openPathDisabled(showingPathsOfExposureMode, path.properties)}
          >
            i
          </OpenPathInfoButton>
        </OpenPathInfoWrapper>
      </MetersContainer>
    </StyledPathListPathBox>
  )
}

export default PathListPathBox

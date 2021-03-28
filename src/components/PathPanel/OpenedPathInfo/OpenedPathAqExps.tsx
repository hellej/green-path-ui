import React from 'react'
import styled from 'styled-components'
import { TravelMode } from '../../../services/paths'
import { AqiClass, PathFeature } from '../../../types'
import { utils } from '../../../utils/index'
import { labelByAqiClass, colorByAqiClass } from './../../../constants'
import T from './../../../utils/translator/Translator'

const StyledOpenedPathExposures = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  pointer-events: auto;
  border-radius: 5px;
  margin: 4px 0px 4px 0px;
  border: 2px solid transparent;
  padding: 1px 0px 2px 4px;
  color: black;
  cursor: default;
  transition-duration: 0.12s;
  width: 95%;
  margin: auto;
`
const PathPropsRow = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  width: 100%;
`
const FlexCols = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 1px 0px 1px;
  justify-content: space-evenly;
`
const StyledAqiLabelBox = styled.div<{ aqiCl: AqiClass }>`
  border-radius: 8px;
  margin: 0px 3px 0px 3px;
  padding: 5px 7px;
  background-color: ${props => colorByAqiClass[props.aqiCl] || 'grey'};
`
const StyledAqiExposureBox = styled.div`
  border-radius: 8px;
  margin: 0px 3px 0px 3px;
  padding: 5px 7px;
`
const StyledAqiExposureRow = styled.div`
  display: flex;
  margin: 2px 0 4px 0px;
  flex-direction: row;
`

const AqiClLabelBox = ({ aqiCl }: { aqiCl: AqiClass }) => {
  return (
    <StyledAqiLabelBox aqiCl={aqiCl}>
      <T>{labelByAqiClass[aqiCl]}</T> ({aqiCl})
    </StyledAqiLabelBox>
  )
}

interface AqiExposureRowProps {
  aqiCl: AqiClass
  aqiClExp: number
  travelMode: TravelMode
}

const AqExposureRow = ({ aqiCl, aqiClExp, travelMode }: AqiExposureRowProps) => {
  return (
    <StyledAqiExposureRow>
      <AqiClLabelBox aqiCl={aqiCl} />
      <StyledAqiExposureBox>
        {utils.getDurationStringFromDist(aqiClExp, travelMode, true)}
      </StyledAqiExposureBox>
    </StyledAqiExposureRow>
  )
}

export const OpenedPathAqExps = ({
  path,
  travelMode,
}: {
  path: PathFeature
  travelMode: TravelMode
}) => {
  const aqiClExps = path.properties.aqi_cl_exps
  const aqiKeys = Object.keys(aqiClExps)
  const aqiCls = aqiKeys.map(aqi => Number(aqi)).sort() as AqiClass[]

  return (
    <StyledOpenedPathExposures>
      <StyledOpenedPathExposures>
        <PathPropsRow>
          <FlexCols>
            {aqiCls.map(aqiCL => (
              <AqExposureRow
                key={aqiCL}
                aqiCl={aqiCL}
                aqiClExp={aqiClExps[aqiCL]}
                travelMode={travelMode}
              />
            ))}
          </FlexCols>
        </PathPropsRow>
      </StyledOpenedPathExposures>
    </StyledOpenedPathExposures>
  )
}

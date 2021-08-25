import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import { setCarTripInfo } from '../../../reducers/pathsReducer'
import { ReduxState } from '../../../types'
import T from './../../../utils/translator/Translator'

const PathRowFlex = styled.div`
  display: flex;
  justify-content: space-around;
`
const CarTripInfoBox = styled.div`
  padding: 0.5em 1.3em;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
  border-radius: 1px;
  border-left: 3px solid;
  border-image: linear-gradient(to bottom, #5e6069, #cecece) 1 100%;
  border-width: 0px 0px 0px 3px;
  margin: 13px 10px;
  line-height: 133%;
  font-size: 14px;
`

const CarTripInfoButton = styled.button`
  margin: 11px;
  cursor: pointer;
  padding: 4px 11px;
  border-radius: 30px;
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
  outline: none;
  color: black;
  border: 1px solid black;
  background-color: white;
  &:focus {
    background-color: #f1f1f1;
  }
`

export const formatDurationMins = (timeSecs: number): string => {
  const timeMin = timeSecs / 60
  return String(Math.round(timeMin)) + ' min'
}

const CarTripInfo = (props: PropsFromRedux) => {
  const { odCoords, carTripInfo, setCarTripInfo } = props

  return (
    <PathRowFlex>
      {!carTripInfo && (
        <CarTripInfoButton onClick={() => setCarTripInfo(odCoords!)}>
          <T>compare-to-car-trip.button.label</T>
        </CarTripInfoButton>
      )}
      {carTripInfo && (
        <CarTripInfoBox>
          <div style={{ fontWeight: 550 }}>
            <T>compare-to-car-trip.with-car.label</T>
          </div>
          <div>
            <T>compare-to-car-trip.duration.label</T>: {formatDurationMins(carTripInfo.duration)}
          </div>
          <div>
            C02: {carTripInfo.co2min}-{carTripInfo.co2max} g
          </div>
        </CarTripInfoBox>
      )}
    </PathRowFlex>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  odCoords: state.paths.odCoords,
  carTripInfo: state.paths.carTripInfo,
})

const connector = connect(mapStateToProps, { setCarTripInfo })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(CarTripInfo)

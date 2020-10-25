import React from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { AqiClass, aqiClassColors } from '../../constants'
import LoadAnimation from './../LoadAnimation/LoadAnimation'
import T from '../../utils/translator/Translator'

const Container = styled.div`
  margin: 7px 5px 5px 5px;
`
const LegendBox = styled.div`
  background-color: #000000c2;
  color: white;
  padding: 8px 8px 8px 8px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
`
const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 1px 5px 9px 5px;
`
const ColorRow = styled.div`
  display: flex;
  margin-bottom: 3px;
`
const ColorBox = styled.div`
  border-radius: 4px;
  margin: 0px 3px;
  width: 15px;
  height: 15px;
`
const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px 0px 1px 0px;
  width: calc(100% - 6px);
`
const LoadAnimationWrapper = styled.div`
  margin: 7px 6px 7px 5px;
`

const ZoomTooltipBox = styled.div`
  padding: 6px 13px;
  color: white;
  font-weight: 400;
  text-align: center;
  max-width: 150px;
  letter-spacing: 1px;
`

const formatUtcSecondsToAmPm = (utcSeconds: number): string => {
  const date = new Date(0)
  date.setUTCSeconds(utcSeconds)
  let hours = date.getHours()
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12
  return hours + ':30 ' + ampm
}

const getDataAgeMinutes = (dataTimeUtcSecs: number): number => {
  const seconds = Date.now() / 1000
  return Math.round((seconds - dataTimeUtcSecs) / 60)
}

const formatAqiTimeInfo = (dataTimeUtcSecs: number): string => {
  const dataAgeMinutes = getDataAgeMinutes(dataTimeUtcSecs)
  if (dataAgeMinutes > 60) {
    return formatUtcSecondsToAmPm(dataTimeUtcSecs)
  } else {
    return 'basemap.air_quality.legend.title.aqi_data_time_now'
  }
}

const AqiMapLegend = (props: PropsFromRedux) => {
  const { loadingData, waitingStyleUpdate, updatingStyle, dataTimeUtcSecs } = props.aqLayer
  return (
    <Container>
      <LegendBox>
        <TitleRow>
          <T>basemap.air_quality.legend.title.air_quality_index</T>
          {dataTimeUtcSecs && (
            <span>
              &nbsp;(<T>{formatAqiTimeInfo(dataTimeUtcSecs)}</T>)
            </span>
          )}
        </TitleRow>
        <ColorRow>
          {Array.from({ length: 8 }, (_, i) => i + 2).map((k: number) => (
            <ColorBox
              key={k.toString()}
              style={{ backgroundColor: aqiClassColors[k as AqiClass] }}
            />
          ))}
        </ColorRow>
        <LabelRow>
          <div>
            <T>basemap.air_quality.legend.label.good</T>
          </div>
          <div>
            <T>basemap.air_quality.legend.label.bad</T>
          </div>
        </LabelRow>
      </LegendBox>
      {props.mapZoom < 12 && (
        <ZoomTooltipBox>
          <T>basemap.air_quality.zoom_closer_tip</T>
        </ZoomTooltipBox>
      )}
      {(loadingData || waitingStyleUpdate || updatingStyle) && props.mapZoom >= 12 && (
        <LoadAnimationWrapper>
          <LoadAnimation size={30} color={'white'} />
        </LoadAnimationWrapper>
      )}
    </Container>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  aqLayer: state.airQualityLayer,
  mapZoom: state.map.zoom,
})

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(AqiMapLegend)

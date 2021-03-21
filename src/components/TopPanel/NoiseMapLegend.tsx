import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import { Basemap, dBColors } from '../../constants'
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
  margin: 0px 5px 8px 5px;
`
const ColorRow = styled.div`
  display: flex;
  margin: 0px 0px 3px 0px;
  font-size: 11px;
`
const ColorLabelBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 1px 0px 1px;
  align-items: center;
`
const ColorBox = styled.div`
  border-radius: 4px;
  margin: 0px 3px 4px 3px;
  width: 16px;
  height: 16px;
`
const ZoomTooltipBox = styled.div`
  padding: 9px 11px;
  color: white;
  font-weight: 400;
  text-align: center;
  max-width: 160px;
  letter-spacing: 1px;
  background-color: #0000004f;
  border-radius: 5px;
  margin: 4px 0 0 0;
  line-height: 120%;
`

const NoiseMapLegend = (props: PropsFromRedux) => {
  const { mapZoom, basemap } = props
  return (
    <Container>
      <LegendBox>
        <TitleRow>
          <T>basemap.traffic_noise.legend.title</T> (dB)
        </TitleRow>
        <ColorRow>
          {[...Object.keys(dBColors)].map(k => (
            <ColorLabelBox key={k}>
              <ColorBox key={k} style={{ backgroundColor: dBColors[parseInt(k) as DbClass] }} />
              <div>{k}</div>
            </ColorLabelBox>
          ))}
        </ColorRow>
      </LegendBox>
      {mapZoom < 12 && basemap === Basemap.NOISE && (
        <ZoomTooltipBox>
          <T>basemap.traffic_noise.zoom_closer_tip</T>
        </ZoomTooltipBox>
      )}
    </Container>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  basemap: state.map.basemap,
  mapZoom: state.map.zoom,
})

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(NoiseMapLegend)

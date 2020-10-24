import React from 'react'
import styled from 'styled-components'
import { dBColors } from '../../constants'
import T from '../../utils/translator/Translator'

const Container = styled.div`
  margin: 7px 5px 5px 5px;
`
const LegendBox = styled.div`
  background-color: #000000c2;
  color: white;
  padding: 8px 8px 8px 8px;
  border-radius: 5px;
`
const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 0px 5px 8px 5px;
`
const ColorRow = styled.div`
  display: flex;
  margin-bottom: 3px;
  font-size: 11px;
`
const ColorLabelBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 2px 0px 2px;
  align-items: center;
`
const ColorBox = styled.div`
  border-radius: 4px;
  margin: 0px 3px 4px 3px;
  width: 15px;
  height: 15px;
`

const NoiseMapLegend = () => {
  return (
    <Container>
      <LegendBox>
        <TitleRow>
          <T>basemap.traffic_noise.legend.title</T> (dB)
        </TitleRow>
        <ColorRow>
          {[...Object.keys(dBColors)].map((k) => (
            <ColorLabelBox key={k}>
              <ColorBox key={k} style={{ backgroundColor: dBColors[parseInt(k) as DbClass] }} />
              <div>{k}</div>
            </ColorLabelBox>
          ))}
        </ColorRow>
      </LegendBox>
    </Container>
  )
}

export default NoiseMapLegend

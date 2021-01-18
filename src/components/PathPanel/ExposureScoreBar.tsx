import React from 'react'
import styled from 'styled-components'
import T from '../../utils/translator/Translator'

const Meter = styled.div`
  width: 100%;
  height: 9px;
  position: relative;
  background: #e2e2e2;
  -moz-border-radius: 25px;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  padding: 5px 6px;
  box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
`

const Bar = styled.span<{ width: number }>`
  display: block;
  height: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color: rgb(12, 223, 68);
  box-shadow: inset 0 2px 7px rgba(255, 255, 255, 0.1), inset 0 -2px 6px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  width: ${(props) => props.width}%;
`

interface Props {
  width: number
  labelKey: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Label = styled.div`
  color: #464646;
  margin: 2px 2px 4px 2px;
  white-space: nowrap;
  font-size: 13px;
  @media (max-width: 400px) {
    font-size: 11px;
  }
`

const ExposureScoreBar = ({ width, labelKey }: Props) => {
  return (
    <Container>
      <Label>
        <T>{labelKey}</T>
      </Label>
      <Meter>
        <Bar width={width} />
      </Meter>
    </Container>
  )
}

export default ExposureScoreBar

import React from 'react'
import styled, { css } from 'styled-components'
import { aqiColors } from '../../constants'

const StyledAqiBar = styled.div<{ withMargins?: boolean }>`
  display: flex;
  width: 94%;
  ${(props) =>
    props.withMargins === true &&
    css`
      margin: 3px 0px 3px 0px;
    `}
`
const StyledAqPc = styled.div<{ first: boolean; last: boolean; pc: number; aqiCl: AqiClass }>`
  height: 8px;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05), 0 3px 4px 0 rgba(0, 0, 0, 0.01);
  width: ${(props) => props.pc || '0'}%;
  background-color: ${(props) => aqiColors[props.aqiCl] || 'grey'};
  ${(props) =>
    props.first &&
    css`
      border-radius: 8px 0px 0px 8px;
    `}
  ${(props) =>
    props.last &&
    css`
      border-radius: 0px 8px 8px 0px;
    `}
  ${(props) =>
    props.first &&
    props.last &&
    css`
      border-radius: 8px;
    `}
`

interface Props {
  aqiPcts: { [key in AqiClass]: number }
  withMargins?: boolean
}

export const PathAqiBar = ({ aqiPcts, withMargins }: Props) => {
  const aqiKeys = Object.keys(aqiPcts)
  const aqis: AqiClass[] = aqiKeys.map((aqi) => Number(aqi)).sort()

  return (
    <StyledAqiBar withMargins={withMargins}>
      {aqis.map((aqiCl, i) => {
        const first = i === 0
        const last = i === aqis.length - 1
        return (
          <StyledAqPc first={first} last={last} key={aqiCl} aqiCl={aqiCl} pc={aqiPcts[aqiCl]} />
        )
      })}
    </StyledAqiBar>
  )
}

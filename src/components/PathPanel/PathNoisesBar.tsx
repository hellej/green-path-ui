import React from 'react'
import styled, { css } from 'styled-components'
import { dBColors } from '../../constants'

const StyledNoiseBar = styled.div<{ withMargins?: boolean }>`
  display: flex;
  width: 94%;
  ${(props) =>
    props.withMargins === true &&
    css`
      margin: 3px 0px 3px 0px;
    `}
`
const StyledNoisePc = styled.div<{ first: boolean; last: boolean; pc: number; dB: DbClass }>`
  height: 8px;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05), 0 3px 4px 0 rgba(0, 0, 0, 0.01);
  width: ${(props) => props.pc || '0'}%;
  background-color: ${(props) => dBColors[props.dB] || 'grey'};
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

interface PathNoisesBarProps {
  noisePcts: { [key in DbClass]: number }
  withMargins?: boolean
}

export const PathNoisesBar = ({ noisePcts, withMargins }: PathNoisesBarProps) => {
  const dBKeys = Object.keys(noisePcts)
  const dBs: DbClass[] = dBKeys.map((dB) => Number(dB)).sort()

  return (
    <StyledNoiseBar withMargins={withMargins}>
      {dBs.map((dB, i) => {
        const first = i === 0
        const last = i === dBs.length - 1
        return <StyledNoisePc first={first} last={last} key={dB} dB={dB} pc={noisePcts[dB]} />
      })}
    </StyledNoiseBar>
  )
}

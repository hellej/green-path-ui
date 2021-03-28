import React from 'react'
import styled, { css } from 'styled-components'
import { colorByGviClass } from '../../constants'
import { GviClass } from '../../types'

const StyledGviBar = styled.div<{ withMargins?: boolean }>`
  display: flex;
  width: 94%;
  ${props =>
    props.withMargins === true &&
    css`
      margin: 3px 0px 3px 0px;
    `}
`
const StyledGviPc = styled.div<{ first: boolean; last: boolean; pc: number; gviCl: GviClass }>`
  height: 8px;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05), 0 3px 4px 0 rgba(0, 0, 0, 0.01);
  width: ${props => props.pc || '0'}%;
  background-color: ${props => colorByGviClass[props.gviCl] || 'grey'};
  ${props =>
    props.first &&
    css`
      border-radius: 8px 0px 0px 8px;
    `}
  ${props =>
    props.last &&
    css`
      border-radius: 0px 8px 8px 0px;
    `}
  ${props =>
    props.first &&
    props.last &&
    css`
      border-radius: 8px;
    `}
`

interface Props {
  gviPcts: { [key in GviClass]: number }
  withMargins?: boolean
}

export const PathGviBar = ({ gviPcts, withMargins }: Props) => {
  const gviKeys = Object.keys(gviPcts)
  const gvis = gviKeys.map(gvi => Number(gvi)).sort() as GviClass[]

  return (
    <StyledGviBar withMargins={withMargins}>
      {gvis.map((gviCl, i) => {
        const first = i === 0
        const last = i === gvis.length - 1
        return (
          <StyledGviPc first={first} last={last} key={gviCl} gviCl={gviCl} pc={gviPcts[gviCl]} />
        )
      })}
    </StyledGviBar>
  )
}

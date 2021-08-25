import React from 'react'
import styled, { css } from 'styled-components'
import { ArrowDown } from './../Icons'

type IconButtonProps = {
  onClick: React.MouseEventHandler<HTMLElement>
  children: any
  up: boolean
}

const IconButton = styled.div<IconButtonProps>`
  cursor: pointer;
  pointer-events: auto;
  display: table;
  color: black;
  margin-left: 15px;
  border-radius: 7px;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  @media (min-width: 600px) {
    &:hover {
      padding-bottom: 3px;
    }
  }
  ${props =>
    props.up &&
    css`
      transform: rotate(180deg);
    `}
`

type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLElement>
  up: boolean
}

const ToggleBottomPanelButton = ({ onClick, up }: ButtonProps) => {
  return (
    <IconButton up={up} onClick={onClick}>
      <ArrowDown />
    </IconButton>
  )
}

export default ToggleBottomPanelButton

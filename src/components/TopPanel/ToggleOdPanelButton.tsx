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
  margin: 6px 0px 0px 15px;
  border-radius: 7px;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  @media (min-width: 600px) {
    &:hover {
      background: #f5f5f5c4;
      border-color: #f5f5f5c4;
    }
  }
  ${(props) =>
    props.up &&
    css`
      margin: 3px 0px 0px 15px;
      transform: rotate(180deg);
    `}
`

type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLElement>
  up: boolean
}

const ToggleOdPanelButton = ({ onClick, up }: ButtonProps) => {
  return (
    <IconButton up={up} onClick={onClick}>
      <ArrowDown />
    </IconButton>
  )
}

export default ToggleOdPanelButton

import React from 'react'
import styled, { css } from 'styled-components'
import { FiFilter } from 'react-icons/fi'
import { IoIosArrowDown } from 'react-icons/io'
import { IoIosClose } from 'react-icons/io'
import { IoMdMenu } from 'react-icons/io'

const iconStyle = `
  vertical-align: middle;
  display: table-cell;
  text-align: center;
`
export const Filter = styled(FiFilter)`
  ${iconStyle}
  font-size: 32px;
`
export const ArrowDown = styled(IoIosArrowDown)`
  ${iconStyle}
  font-size: 43px;
`
const Close = styled(IoIosClose)`
  ${iconStyle}
  font-size:  ${props => props.size || '10'}px;
`
const List = styled(IoMdMenu)`
  ${iconStyle}
  font-size: 36px;
`

type IconButtonProps = {
  onClick: React.MouseEventHandler<HTMLElement>
  children: any
  padding?: string
  leftMargin?: string
  hoverJump?: any
}

const IconButton = styled.div<IconButtonProps>`
  cursor: pointer;
  pointer-events: auto;
  padding: ${props => props.padding || '0px'};
  margin-left: ${props => props.leftMargin || '0px'};
  display: table;
  color: black;
  border-radius: 7px;
  ${props =>
    props.hoverJump &&
    css`
      @media (min-width: 600px) {
        &:hover {
          padding-bottom: 3px;
        }
      }
    `}
`

type IconProps = {
  onClick: React.MouseEventHandler<HTMLElement>
  size?: number
}

export const FilterButton = ({ onClick }: IconProps) => (
  <IconButton padding="5px" onClick={onClick}>
    <Filter />
  </IconButton>
)

export const CloseButton = ({ onClick, size }: IconProps) => (
  <IconButton onClick={onClick}>
    <Close size={size} />
  </IconButton>
)

export const ListButton = ({ onClick }: IconProps) => (
  <IconButton hoverJump onClick={onClick}>
    <List />
  </IconButton>
)

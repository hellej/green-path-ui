import React from 'react'
import styled, { css } from 'styled-components'
import { IoIosArrowForward } from 'react-icons/io'
import { IoIosArrowBack } from 'react-icons/io'

const iconStyle = `
  vertical-align: middle;
  display: table-cell;
  text-align: center;
  font-size: 31px;
`
const ArrowForward = styled(IoIosArrowForward)`
  ${iconStyle}
`
const ArrowBack = styled(IoIosArrowBack)`
  ${iconStyle}
`
const IconButton = styled.div<{ padding?: string, leftMargin: string }>`
  padding: ${props => props.padding || '0px'};
  margin-left: ${props => props.leftMargin || '0px'};
  display: table;
  border-radius: 7px;
`
const ArrowForwardButton = () => {
  return (
    <IconButton
      leftMargin={'-3px'}> <ArrowForward />
    </IconButton>
  )
}

const ArrowBackButton = () => {
  return (
    <IconButton
      leftMargin={'-6px'}>
      <ArrowBack />
    </IconButton>
  )
}

const StyledOpenClosePathBox = styled.div<{ close?: any, disabled?: boolean }>`
  display: flex;
  align-items: center;
  pointer-events: auto;
  cursor: pointer;
  width: 21px;
  height: 48px;
  border-radius: 5px;
  background-color: white;
  border: 2px solid transparent;
  padding: 3px 4px;
  color: black;
  transition-duration: 0.12s;
  box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.1), 0 3px 4px 0 rgba(0, 0, 0, 0.13);
  margin: 4px 0px 4px 0px;
  @media (min-width: 600px) {
    &:hover { 
      box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.15), 0 3px 4px 0 rgba(0, 0, 0, 0.2);
    }
  }
  ${props => props.close && css`
    height: 36px;
  `}
  ${props => props.disabled === true && css`
    color: gray;
    cursor: default;
    pointer-events: none;
    &:hover {
      box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.1), 0 3px 4px 0 rgba(0, 0, 0, 0.13);
    }
  `}
`

export const OpenPathBox = ({ disabled, handleClick }: { disabled: boolean, handleClick: React.MouseEventHandler<HTMLElement> }) => {
  return (
    <StyledOpenClosePathBox className="open-path-button" disabled={disabled} onClick={handleClick}>
      <ArrowForwardButton />
    </StyledOpenClosePathBox>
  )
}

export const ClosePathBox = ({ handleClick }: { handleClick: React.MouseEventHandler<HTMLElement> }) => {
  return (
    <StyledOpenClosePathBox className="close-path-button" close onClick={handleClick}>
      <ArrowBackButton />
    </StyledOpenClosePathBox>
  )
}

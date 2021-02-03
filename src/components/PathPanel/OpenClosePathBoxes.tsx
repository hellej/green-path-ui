import React from 'react'
import styled, { css } from 'styled-components'
import { IoIosArrowForward } from 'react-icons/io'
import { IoIosArrowBack } from 'react-icons/io'

const iconStyle = `
  display: inline-block;
  vertical-align: middle;
  font-size: 31px;
`
const ArrowForward = styled(IoIosArrowForward)`
  ${iconStyle}
`
const ArrowBack = styled(IoIosArrowBack)`
  ${iconStyle}
`
const StyledOpenClosePathBox = styled.button<{ close?: any, disabled?: boolean }>`
  display: inline-block;
  align-items: center;
  pointer-events: auto;
  cursor: pointer;
  width: 37px;
  height: 45px;
  border-radius: 5px;
  background-color: white;
  border: 2px solid transparent;
  color: black;
  padding: 0 0 0 1px;
  transition-duration: 0.12s;
  box-shadow: 0 -1px 6px 0 rgb(0 0 0 / 8%), 0 3px 4px 0 rgb(0 0 0 / 8%);
  @media (min-width: 600px) {
    &:hover { 
      box-shadow: 0 -1px 7px 0 rgb(0 0 0 / 9%), 0 3px 5px 0 rgb(0 0 0 / 10%);
    }
  }
  @media (max-width: 350px) {
    width: 33px;
  }
  ${props => props.close && css`
    padding: 0px 1px 0px 0px;
    margin-top: 2px;
  `}
  ${props => props.disabled === true && css`
    color: gray;
    cursor: default;
    pointer-events: none;
    &:hover {
      box-shadow: 0 -1px 6px 0 rgb(0 0 0 / 8%), 0 3px 4px 0 rgb(0 0 0 / 8%);
    }
  `}
`

export const OpenPathBox = ({ disabled, handleClick }: { disabled: boolean, handleClick: React.MouseEventHandler<HTMLElement> }) => {
  return (
    <StyledOpenClosePathBox className="open-path-button" disabled={disabled} onClick={handleClick}>
      <ArrowForward />
    </StyledOpenClosePathBox>
  )
}

export const ClosePathBox = ({ handleClick }: { handleClick: React.MouseEventHandler<HTMLElement> }) => {
  return (
    <StyledOpenClosePathBox className="close-path-button" close onClick={handleClick}>
      <ArrowBack />
    </StyledOpenClosePathBox>
  )
}

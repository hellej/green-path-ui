import React from 'react'
import styled from 'styled-components'
import T from './../../utils/translator/Translator'

const Button = styled.div`
  cursor: pointer;
  padding: 3px 10px;
  margin: 2px 0px 2px -1px;
  color: white;
  border-radius: 25px;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  width: max-content;
  letter-spacing: 1px;
  max-width: 90%;
  font-size: 15px;
  overflow: auto;
  height: auto;
  pointer-events: auto;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  background-color: #23a50d;
  @media (min-width: 600px) {
    &:hover {
      background-color: #188007;
    }
  }
`

type Props = {
  handleClick: React.MouseEventHandler<HTMLElement>
}

const UseCurrLocButton = ({ handleClick }: Props) => {
  return (
    <Button onClick={handleClick}>
      <T>od_inputs.use_current_location</T>
    </Button>
  )
}

export default UseCurrLocButton

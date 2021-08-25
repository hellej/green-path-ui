import styled, { css } from 'styled-components'

interface Props {
  visible?: boolean
  border?: any
  small?: any
  smaller?: any
  smallest?: any
  green?: any
  white?: any
  bold?: any
  shadow?: any
  disabled?: boolean
}

export const Button = styled.div.attrs((props: Props) => ({
  style: ({ display: props.visible ? '' : 'none' }),
})) <Props>`
  cursor: pointer;
  padding: 6px 14px;
  color: white;
  border-radius: 30px;
  margin: 5px 6px;
  font-weight: 400;
  font-size: 28px;
  text-align: center;
  width: max-content;
  letter-spacing: 1px;
  max-width: 90%;
  overflow: auto;
  height: auto;
  pointer-events: auto;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  &:hover { 
    background-color: #119034e8;
  }
  ${props => props.border && css`
    border: 1px solid white;
  `}
  ${props => props.small && css`
  font-size: 20px;
  `}
  ${props => props.smaller && css`
  padding: 4px 12px;
  font-size: 20px;
  `}
  ${props => props.smallest && css`
    font-size: 18px;
  `}
  ${props => props.green && css`
    background-color: #17af40e8;
    color: white;
    &:hover { 
      background-color: #128a32e8;
    }
  `}
  ${props => props.white && css`
    background-color: white;
    color: black;
    border: 2px solid black;
    &:hover { 
      color: white
      background-color: black;
    }
  `}
  ${props => props.bold && css`
    font-weight: 500;
  `}
  ${props => props.shadow && css`
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.22), 0 6px 20px 0 rgba(0,0,0,0.14);
  `}
`

Button.defaultProps = {
  visible: true,
}

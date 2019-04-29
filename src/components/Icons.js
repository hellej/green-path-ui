
import styled, { css } from 'styled-components'
import { FaStar } from 'react-icons/fa'

export const IconDiv = styled.div`
  margin: 0 0 0 2px;
  display: table;
  color: #00ba0a;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
`
export const Star = styled(FaStar)`
  font-size: 13px;
  vertical-align: middle;
  display: table-cell;
  text-align: center;
`

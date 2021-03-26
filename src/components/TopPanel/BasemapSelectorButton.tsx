import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { showInfo } from './../../reducers/uiReducer'
import { FaLayerGroup } from 'react-icons/fa'
import { ReduxState } from '../../types'

const StyledLayersIcon = styled(FaLayerGroup)`
  font-size: 23px;
  vertical-align: middle;
  display: table-cell;
  text-align: center;
`

const StyledButton = styled.div<{ onClick: Function }>`
  pointer-events: auto;
  cursor: pointer;
  padding: 5px 7px;
  font-weight: 640;
  border-radius: 8px;
  font-size: 22px;
  border: 2px solid black;
  background-color: white;
  color: black;
  width: min-content;
  display: flex;
  align-items: center;
  justify-items: center;
  @media (min-width: 600px) {
    &:hover {
      margin-right: 2px;
    }
  }
`

const BasemapSelectorButton = (props: PropsFromRedux & { handleClick: MouseEventHandler }) => {
  return (
    <StyledButton id="show-basemap-selector-button" onClick={props.handleClick}>
      <StyledLayersIcon />
    </StyledButton>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  ui: state.ui,
})

const connector = connect(mapStateToProps, { showInfo })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(BasemapSelectorButton)

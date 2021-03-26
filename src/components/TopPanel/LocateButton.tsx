import React from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { MdNearMe } from 'react-icons/md'
import { zoomToUserLocation } from '../../reducers/userLocationReducer'
import { ReduxState } from '../../types'

const ButtonContainer = styled.div`
  padding: 2px 3px 2px 2px;
  margin: 1px 5px 1px 5px;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 5px;
  border: 1px solid white;
  transition-duration: 0.15s;
  -webkit-transition-duration: 0.15s; /* Safari */
  @media (min-width: 550px) {
    &:hover {
      background: #f5f5f5c4;
      border-color: #f5f5f5c4;
    }
  }
`
const Locate = styled(MdNearMe)`
  vertical-align: middle;
  display: table-cell;
  text-align: center;
  font-size: 28px;
`
const StyledIcon = styled.div`
  cursor: pointer;
  pointer-events: auto;
  margin: 0px 0px;
  display: table;
  color: black;
  border-radius: 7px;
`

export const LocateButton = ({ zoomToUserLocation, userLocation }: PropsFromRedux) => {
  return (
    <ButtonContainer onClick={() => zoomToUserLocation(userLocation)}>
      <StyledIcon>
        <Locate />
      </StyledIcon>
    </ButtonContainer>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  menu: state.ui,
  userLocation: state.userLocation,
})

const connector = connect(mapStateToProps, { zoomToUserLocation })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(LocateButton)

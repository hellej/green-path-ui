import React from 'react'
import styled, { css } from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import OriginInput from './OriginInput'
import DestinationInput from './DestinationInput'

const OdContainer = styled.div<{ hide?: boolean }>`
  pointer-events: auto;
  padding: 2px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${props =>
    props.hide === true &&
    css`
      display: none;
    `}
  @media (min-width: 780px) {
    flex-direction: row;
    justify-content: space-evenly;
  }
`

const OrigDestPanel = (props: PropsFromRedux) => {
  const { showingPaths, waitingPaths } = props

  return (
    <OdContainer id="od-container" hide={waitingPaths || showingPaths}>
      <OriginInput />
      <DestinationInput />
    </OdContainer>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  waitingPaths: state.paths.waitingPaths,
  showingPaths: state.paths.showingPaths,
})

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(OrigDestPanel)

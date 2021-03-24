import React from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { resetPaths } from '../../reducers/pathsReducer'
import { IoIosArrowBack } from 'react-icons/io'
import { turf } from './../../utils/index'
import { ReduxState } from '../../types'

const ButtonContainer = styled.div`
  padding: 2px 3px 2px 0px;
  margin: 1px 5px 1px 10px;
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

const ArrowBack = styled(IoIosArrowBack)`
  vertical-align: middle;
  display: table-cell;
  text-align: center;
  font-size: 31px;
`

const ResetPathsButton = ({ resetPaths, originObject, destObject }: PropsFromRedux) => {
  const odFc = turf.asFeatureCollection([originObject!, destObject!])
  return (
    <ButtonContainer id="reset-paths-container" onClick={() => resetPaths(odFc)}>
      <ArrowBack />
    </ButtonContainer>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  originObject: state.origin.originObject,
  destObject: state.destination.destObject,
})

const connector = connect(mapStateToProps, { resetPaths })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(ResetPathsButton)

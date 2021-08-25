import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import { ReduxState } from '../../types'

const DimDiv = styled.div<{ visible?: boolean }>`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  opacity: ${props => (props.visible ? 1 : 0)};
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  margin: 0px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 8;
  transition: visibility 0.7s linear, opacity 0.7s linear;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
  background: rgba(5, 5, 5, 0.5);
`

const DimLayer = (props: PropsFromRedux) => {
  return <DimDiv visible={props.ui.info} />
}

const mapStateToProps = (state: ReduxState) => ({ ui: state.ui })

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(DimLayer)

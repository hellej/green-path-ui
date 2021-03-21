// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import store from '../../store'
import { setOriginFromMap } from '../../reducers/originReducer'
import { setDestinationFromMap } from '../../reducers/destinationReducer'
import { Button } from '../Button'
import T from '../../utils/translator/Translator'

const StyledPopupDiv = styled.div`
  margin: -5px 11px -10px -6px;
`

class SelectLocationsPopup extends React.Component<PropsFromRedux> {
  render() {
    const { visible, lngLat } = this.props
    if (!visible) return null

    return (
      <StyledPopupDiv>
        <Button
          smallest
          border
          green
          disabled={false}
          onClick={() => store.dispatch(setOriginFromMap(lngLat))}
        >
          <T>map_od_popup.button.set_origin.label</T>
        </Button>
        <Button
          smallest
          border
          green
          disabled={false}
          onClick={() => store.dispatch(setDestinationFromMap(lngLat))}
        >
          <T>map_od_popup.button.set_destination.label</T>
        </Button>
      </StyledPopupDiv>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  visible: state.mapPopup.visible,
  lngLat: state.mapPopup.lngLat,
})

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(SelectLocationsPopup)

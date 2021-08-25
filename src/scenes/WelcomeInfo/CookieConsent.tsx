import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import { disableAnalyticsCookies } from './../../reducers/visitorReducer'
import T from '../../utils/translator/Translator'

const SmallText = styled.div`
  font-size: 12px;
`
const DisableGaWrapper = styled.div`
  display: grid;
  justify-items: center;
  width: 95%;
`
const DisableGaButton = styled.div`
  cursor: pointer;
  padding: 6px 13px;
  margin: 7px 0 0 0;
  color: black;
  border-radius: 30px;
  font-weight: 400;
  text-align: center;
  width: max-content;
  letter-spacing: 1px;
  border: 1px solid black;
  pointer-events: auto;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
`

const CookieConsent = (props: PropsFromRedux) => {
  return (
    <SmallText>
      <T>info_modal.cookie.info</T>
      <DisableGaWrapper>
        <DisableGaButton onClick={props.disableAnalyticsCookies}>
          <T>info_modal.cookie.disable_button_label</T>
        </DisableGaButton>
      </DisableGaWrapper>
    </SmallText>
  )
}

const connector = connect(null, { disableAnalyticsCookies })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(CookieConsent)

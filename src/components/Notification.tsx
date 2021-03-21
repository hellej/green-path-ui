import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled, { css } from 'styled-components'
import T from './../utils/translator/Translator'

const OuterFlex = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10px 13px 10px;
  align-items: center;
`
const StyledNotificationDiv = styled.div<{ look: string | null }>`
  padding: 7px 13px;
  border-radius: 5px;
  margin: 0;
  max-width: 80%;
  color: white;
  overflow-wrap: break-word;
  background: rgba(0, 0, 0, 0.75);
  display: inline;
  white-space: pre-wrap;
  line-height: 1.3;
  font-size: 17px;
  font-weight: 350;
  letter-spacing: 1.2px;
  word-break: break-word;
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.22), 0 6px 20px 0 rgba(0, 0, 0, 0.14);
  ${props =>
    props.look === 'error' &&
    css`
      color: white;
      background-color: rgba(70, 10, 10, 0.87);
    `}
`

const Notification = (props: PropsFromRedux) => {
  const { origError, destError } = props
  const origOrDestError = origError || destError
  if (!props.notification.text && !origOrDestError) return null
  const look = origOrDestError ? 'error' : props.notification.look

  return (
    <OuterFlex>
      <StyledNotificationDiv look={look}>
        {props.notification.text && (
          <div>
            <T>{props.notification.text}</T>
          </div>
        )}
        {origError && (
          <div>
            <T>{origError}</T>
          </div>
        )}
        {destError && (
          <div>
            <T>{destError}</T>
          </div>
        )}
      </StyledNotificationDiv>
    </OuterFlex>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  notification: state.notification,
  origError: state.origin.error,
  destError: state.destination.error,
})

const connector = connect(mapStateToProps, {})
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(Notification)

import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import T from '../utils/translator/Translator'
import * as serviceWorker from './../serviceWorkerRegistration'

const Wrapper = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 1000;
`
const Container = styled.a`
  padding: 10px 13px;
  cursor: pointer;
  pointer-events: auto;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: white;
  pointer-events: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.07);
  max-width: calc(100% - 60px);
  flex-direction: column;
  div {
    margin: 5px 0px 0px 0px;
  }
  @media (min-width: 440px) {
    flex-direction: row;
    div {
      margin: 0px 0px 0px 8px;
    }
  }
`

const ServiceWorkerWrapper: FC = () => {
  const [showReload, setShowReload] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true)
    setWaitingWorker(registration.waiting)
  }

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate })
  }, [])

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    setShowReload(false)
    window.location.reload() // or reload(true) to force reload (deprecated)?
  }

  return (
    (showReload && (
      <Wrapper>
        <Container onClick={reloadPage}>
          <T>update_available_title</T>
          <div>
            <T>update_available_tooltip</T>
          </div>
        </Container>
      </Wrapper>
    )) ||
    null
  )
}

export default ServiceWorkerWrapper

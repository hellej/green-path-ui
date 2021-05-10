import React, { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import LoadAnimation from './LoadAnimation/LoadAnimation'
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
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [showReload, setShowReload] = useState(false)
  const [updating, setUpdating] = useState(false)
  const updated = useRef(false)

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true)
    setWaitingWorker(registration.waiting)
  }

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate })
  }, [])

  const updateServiceWorker = () => {
    setShowReload(false)
    setUpdating(true)

    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      // reload on service worker statechange -> activated
      waitingWorker.addEventListener('statechange', (e: any) => {
        if (e.target.state === 'activated') {
          updated.current = true
          setUpdating(false)
          window.location.reload()
        }
      })
    }

    // reload after timeout if the statechange event did not fire
    setTimeout(() => {
      if (!updated.current) {
        updated.current = true
        setUpdating(false)
        window.location.reload()
      }
    }, 2500)
  }

  return (
    ((showReload || updating) && (
      <Wrapper>
        {showReload && (
          <Container onClick={updateServiceWorker}>
            <T>update_available_title</T>
            <div>
              <T>update_available_tooltip</T>
            </div>
          </Container>
        )}
        {updating && <LoadAnimation size={30} color={'black'} />}
      </Wrapper>
    )) ||
    null
  )
}

export default ServiceWorkerWrapper

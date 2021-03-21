import React from 'react'
import styled from 'styled-components'
import HopeLogo from '../Images/Hope_black_url.png'

const Container = styled.div`
  position: absolute;
  bottom: 3px;
  left: 0px;
  right: 0px;
  z-index: 2;
  display: flex;
  justify-content: center;
  pointer-events: none;
`
const StyledHopeLink = styled.a`
  color: white;
  border-radius: 5px;
  pointer-events: auto;
  padding: 2px 6px;
  cursor: pointer;
  text-decoration: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  @media (min-width: 600px) {
    &:hover {
      margin-bottom: 2px;
    }
  }
`

const HopeLink = () => {
  return (
    <Container>
      <StyledHopeLink href="https://ilmanlaatu.eu/" target="_blank" rel="noopener noreferrer">
        <img src={HopeLogo} width="78" height="20" alt="HopeLogo" />
      </StyledHopeLink>
    </Container>
  )
}

export default HopeLink

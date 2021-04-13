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
  justify-content: flex-end;
  align-items: flex-end;
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
const OsmLinkContainer = styled.div`
  display: flex;
  max-width: 60%;
  flex-wrap: wrap;
  margin-right: 2px;
  @media (max-width: 400px) {
    max-width: 50%;
  }
`
const OsmLink = styled.a`
  color: black;
  font-size: 12px;
  margin: 1px 3px;
  padding: 0px 1px 1px 1px;
  border-radius: 2px;
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.4);
  @media (max-width: 400px) {
    font-size: 11px;
  }
`

const Attribution = () => {
  return (
    <Container>
      <StyledHopeLink href="https://ilmanlaatu.eu/" target="_blank" rel="noopener noreferrer">
        <img src={HopeLogo} width="78" height="20" alt="HopeLogo" />
      </StyledHopeLink>
      <OsmLinkContainer role="list">
        <OsmLink href="https://www.mapbox.com/about/maps/" target="_blank" rel="noreferrer">
          © Mapbox
        </OsmLink>
        <OsmLink href="http://www.openstreetmap.org/about/" target="_blank" rel="noreferrer">
          © OpenStreetMap
        </OsmLink>
        <OsmLink
          href="https://apps.mapbox.com/feedback/?owner=joose&amp;id=cjvbyzwuk31oe1fohk6s9ev4b&amp;access_token=pk.eyJ1Ijoiam9vc2UiLCJhIjoiY2pkaWtwMWU1MGFjYzMzcXB6cDI4cG4ybCJ9.TZX6Fjx5bqDG32SzEyURDw"
          target="_blank"
          rel="noreferrer"
          title="Map feedback"
          aria-label="Map feedback"
        >
          Improve this map
        </OsmLink>
      </OsmLinkContainer>
    </Container>
  )
}

export default Attribution

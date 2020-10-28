import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'
import TravelModeSelector from './TravelModeSelector'
import ResetPathsButton from './ResetPathsButton'
import LocateButton from './LocateButton'
import ToggleLanguageButton from './ToggleLanguageButton'
import ToggleOdPanelButton from './ToggleOdPanelButton'
import { setOdPanelHidden } from './../../reducers/uiReducer'
import { useLocation, useHistory } from 'react-router-dom'

const OuterContainer = styled.div`
  display: flex;
`

const ResetContainer = styled.div`
  display: flex;
  align-items: center;
  @media (min-width: 1099px) {
    margin-left: 119px;
  }
`

const SettingsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 15px;
  padding: 4px 5px;
  width: 80%;
`
const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: 15px;
  padding: 4px 11px 4px 10px;
  width: 20%;
`

const RoutingSettingsRow = (props: PropsFromRedux) => {
  const { showingPaths, waitingPaths, odPanelHidden, setOdPanelHidden } = props

  const location = useLocation()
  const history = useHistory()

  const handleSetOdPanelHidden = (hidden: boolean) => {
    setOdPanelHidden(hidden, location, history)
  }

  return (
    <OuterContainer>
      <ResetContainer>{showingPaths || waitingPaths ? <ResetPathsButton /> : null}</ResetContainer>
      <SettingsContainer>
        <LocateButton />
        <TravelModeSelector />
      </SettingsContainer>
      {!showingPaths && !waitingPaths && (
        <ToggleOdPanelButton
          onClick={() => handleSetOdPanelHidden(!odPanelHidden)}
          up={!odPanelHidden}
        />
      )}
      <LanguageContainer>
        <ToggleLanguageButton />
      </LanguageContainer>
    </OuterContainer>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  showingPaths: state.paths.showingPaths,
  waitingPaths: state.paths.waitingPaths,
  odPanelHidden: state.ui.odPanelHidden,
})

const connector = connect(mapStateToProps, { setOdPanelHidden })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(RoutingSettingsRow)

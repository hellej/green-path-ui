import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { showInfo } from './../../reducers/uiReducer'
import { setBaseMap } from './../../reducers/mapReducer'
import BasemapSelectorButton from './BasemapSelectorButton'
import { CloseButton } from './../Icons'
import { Basemap } from '../../constants'
import T from '../../utils/translator/Translator'

const Wrapper = styled.div`
  margin: 15px 5px 0px 0px;
`
const OptionContainer = styled.div`
  background: white;
  padding: 9px;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.06), 0 6px 20px 0 rgba(0,0,0,0.03);
  pointer-events: auto;
`
const BaseMapOption = styled.div<{ bike?: any, selected: boolean }>`
  cursor: pointer;
  pointer-events: auto;
  display: flex;
  margin: 7px 4px;
  padding: 7px 13px;
  border-radius: 25px;
  align-content: center;
  justify-content: center;
  background: #f5f5f5c4;
  border: 1px solid #f5f5f5c4;
  transition-duration: 0.15s;
  -webkit-transition-duration: 0.15s; /* Safari */
  @media (min-width: 550px) {
    &:hover { 
      border-color: black;
    }
  }
  ${props => props.selected === true && css`
    background: #eaf8ff;
    border-color: #65a1bd;
    pointer-events: none;
    &:hover { 
      border-color: #65a1bd;
    }
  `}
`
const AlignCloseButton = styled.div`
  display: flex;
  justify-content: center;
  margin: -4px 0px;
`

const BasemapSelector = (props: PropsFromRedux) => {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <Wrapper>
      {!showOptions && <BasemapSelectorButton handleClick={() => setShowOptions(true)} />}
      {showOptions &&
        <OptionContainer>
          <AlignCloseButton>
            <CloseButton size={40} onClick={() => setShowOptions(false)} />
          </AlignCloseButton>
          <BaseMapOption
            selected={props.basemap === Basemap.STREETS}
            onClick={() => props.setBaseMap(Basemap.STREETS)}>
            <T>basemap_selector.option.label.streets</T>
          </BaseMapOption>
          <BaseMapOption
            selected={props.basemap === Basemap.NOISE}
            onClick={() => props.setBaseMap(Basemap.NOISE)}>
            <T>basemap_selector.option.label.traffic_noise</T>
          </BaseMapOption>
          <BaseMapOption
            selected={props.basemap === Basemap.AIR_QUALITY}
            onClick={() => props.setBaseMap(Basemap.AIR_QUALITY)}>
            <T>basemap_selector.option.label.air_quality</T>
          </BaseMapOption>
          <BaseMapOption
            selected={props.basemap === Basemap.SATELLITE}
            onClick={() => props.setBaseMap(Basemap.SATELLITE)}>
            <T>basemap_selector.option.label.satellite</T>
          </BaseMapOption>
        </OptionContainer>}
    </Wrapper>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  ui: state.ui,
  basemap: state.map.basemap
})

const connector = connect(mapStateToProps, { showInfo, setBaseMap })
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(BasemapSelector)
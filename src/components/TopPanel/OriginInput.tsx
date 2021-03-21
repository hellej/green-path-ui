import React, { Component, RefObject } from 'react'
import styled, { css } from 'styled-components'
import { connect, ConnectedProps } from 'react-redux'
import { text } from '../../utils/translator/dictionary'
import { IoIosClose } from 'react-icons/io'
import UseCurrLocButton from './UseCurrLocButton'
import {
  setOriginInputText,
  setGeocodedOrigin,
  setUsedOrigin,
  hideOriginOptions,
  toggleOriginOptionsVisible,
  resetOriginInput,
  useUserLocationOrigin,
} from '../../reducers/originReducer'
import LoadAnimation from './../LoadAnimation/LoadAnimation'

const OrigSelectorDiv = styled.div`
  margin: 5px 5px 5px 5px;
  position: relative;
  width: 90%;
  max-width: 350px;
  z-index: 4;
`
const Input = styled.input<{ onChange: Function }>`
  padding: 10px 10px 9px 10px;
  width: calc(100% - 20px);
  color: black;
  background: white;
  border: 1px solid black;
  font-size: 17px;
  border-radius: 3px;
`
const WaitForUserLocContainer = styled.span`
  position: absolute;
  top: 8px;
  left: 20px;
`
const ResetLocButton = styled.div`
  cursor: pointer;
  position: absolute;
  pointer-events: auto;
  display: flex;
  align-items: center;
  color: black;
  border-radius: 7px;
  top: 0px;
  right: 0px;
  height: 100%;
`
const CloseIcon = styled(IoIosClose)`
  vertical-align: middle;
  display: table-cell;
  text-align: center;
  font-size: 41px;
`
const OrigOptions = styled.ul`
  z-index: -1;
  border-radius: 0 0 4px 4px;
  line-height: 1.5;
  padding: 0;
  padding-top: 2px;
  margin: -3px 0px 0px 1px;
  list-style-type: none;
  font-weight: normal;
  cursor: pointer;
  position: absolute;
  width: calc(100% - 1px);
  background-color: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.06);
  max-height: calc(100vh - 57px);
  overflow: auto;
`
const OrigOption = styled.li<{ noShadow?: any }>`
  padding: 7px 8px;
  margin: 8px;
  border-radius: 3px;
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  transition-duration: 0.15s;
  -webkit-transition-duration: 0.15s; /* Safari */
  @media (min-width: 600px) {
    &:hover {
      box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.16);
    }
  }
  ${props =>
    props.noShadow &&
    css`
      box-shadow: none;
    `}
`

class OriginInput extends Component<PropsFromRedux> {
  wrapperRef: RefObject<HTMLDivElement>
  constructor(props: PropsFromRedux) {
    super(props)
    this.wrapperRef = React.createRef()
    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef(node: any) {
    this.wrapperRef = node
  }

  handleClickOutside(event: any) {
    if (
      this.wrapperRef &&
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.props.hideOriginOptions()
    }
  }

  render() {
    const {
      waitingUserLocOrigin,
      originInputText,
      originOptionsVisible,
      originOptions,
    } = this.props.origin
    const {
      lang,
      destObject,
      useUserLocationOrigin,
      setOriginInputText,
      setGeocodedOrigin,
      setUsedOrigin,
      resetOriginInput,
      toggleOriginOptionsVisible,
    } = this.props

    return (
      <OrigSelectorDiv id="origin-input-container" ref={this.wrapperRef}>
        <Input
          id="origin-input"
          placeholder={text(lang, 'od_inputs.from_label')}
          type="text"
          value={originInputText}
          onClick={toggleOriginOptionsVisible}
          onChange={setOriginInputText}
        />
        {waitingUserLocOrigin && (
          <WaitForUserLocContainer>
            <LoadAnimation size={25} />
          </WaitForUserLocContainer>
        )}
        <ResetLocButton id="reset-origin-button" onClick={resetOriginInput}>
          <CloseIcon />
        </ResetLocButton>
        {originOptionsVisible && (
          <OrigOptions>
            <OrigOption
              noShadow
              onClick={e => useUserLocationOrigin(e, this.props.userLocation, destObject)}
            >
              <UseCurrLocButton
                handleClick={e => useUserLocationOrigin(e, this.props.userLocation, destObject)}
              />
            </OrigOption>
            {originInputText.length < 3 &&
              this.props.usedOds.map(odPlace => (
                <OrigOption
                  key={odPlace.properties.label}
                  style={{ color: '#ff38ff' }}
                  onClick={() => setUsedOrigin(odPlace, destObject)}
                >
                  {odPlace.properties.label}
                </OrigOption>
              ))}
            {originOptions.map(option => (
              <OrigOption
                key={option.properties.gid}
                onClick={() => setGeocodedOrigin(option, destObject)}
              >
                {option.properties.label}
              </OrigOption>
            ))}
          </OrigOptions>
        )}
      </OrigSelectorDiv>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  userLocation: state.userLocation,
  origin: state.origin,
  destObject: state.destination.destObject,
  usedOds: state.visitor.usedOds,
  lang: state.ui.lang,
})

const mapDispatchToProps = {
  useUserLocationOrigin,
  setOriginInputText,
  setGeocodedOrigin,
  setUsedOrigin,
  hideOriginOptions,
  toggleOriginOptionsVisible,
  resetOriginInput,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(OriginInput)

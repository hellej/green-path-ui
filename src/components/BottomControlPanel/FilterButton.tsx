import React from 'react'
import styled, { css } from 'styled-components'
import { Filter } from './../Icons'

const StyledButton = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  padding: 5px;
  margin-right: -30px;
  color: black;
  ${props =>
    props.disabled === true &&
    css`
      color: #989898;
      pointer-events: none;
    `}
  @media (min-width: 600px) {
    &:hover {
      padding-top: 3px;
    }
  }
`
const FilterCount = styled.div`
  letter-spacing: 1px;
  font-size: 14px;
  margin-left: 1px;
`

interface FilterButtonProps {
  onClick: any
  greenPathCount: number
  lengthLimit: LengthLimit
  lengthLimits: LengthLimit[]
}

const FilterButton = (props: FilterButtonProps) => {
  const { onClick, greenPathCount, lengthLimit, lengthLimits } = props
  const disabled = lengthLimits.length <= 1
  return (
    <StyledButton id="filter-by-length-button" disabled={disabled} onClick={onClick}>
      <Filter />
      <FilterCount>
        {lengthLimit.count}/{greenPathCount + 1}
      </FilterCount>
    </StyledButton>
  )
}

export default FilterButton

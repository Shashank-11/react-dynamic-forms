import styled from 'styled-components'
import { layoutSizes } from '../../constants/css'

export const LayoutWrapper = styled.div`
  display: block;
  margin-top: 150px;
`
export const LayoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const NavLayout = styled.div`
  width: 320px;
  margin: auto;
  @media only screen and (min-width: ${layoutSizes.iPadWidth}) {
    margin: auto 10px;
    width: 400px;
  }
`


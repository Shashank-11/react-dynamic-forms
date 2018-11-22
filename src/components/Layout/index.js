import React from 'react'

import {
  LayoutWrapper, 
  LayoutContainer, 
  NavLayout,
} from './style'

import Container from '../_global/Container'
import Form from '../Form'
import { formField } from './layoutUtils.js'

const Layout = () => (
  <LayoutWrapper>
    <Container>
      <LayoutContainer>
        <NavLayout>
          <Form
            title='Sign Up'
            fields={formField}
          />
        </NavLayout>
      </LayoutContainer>
    </Container>
  </LayoutWrapper>
)
export default Layout

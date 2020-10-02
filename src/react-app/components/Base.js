import React from 'react'
import { Layout } from 'antd'

import MainContent from './MainContent'

const { Content, Footer } = Layout

function Base () {
  return (
    <Layout className='height-min-100'>
      <Content theme='light' className='height-min-100'>
        <MainContent />
      </Content>
      <Footer style={{ textAlign: 'center' }}>FischerKarte ©2020 Created by Sharang Pai</Footer>
    </Layout>
  )
}

export default Base

import React from 'react'
import { Layout } from 'antd'

import MainContent from './MainContent'

const { Content } = Layout

function Base () {
  return (
    <Layout className='height-min-100'>
      <Content theme='light' className='height-min-100'>
        <MainContent />
      </Content>
    </Layout>
  )
}

export default Base

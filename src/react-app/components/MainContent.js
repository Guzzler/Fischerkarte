import React from 'react'
import { Row } from 'antd'
import {
  Route,
  Switch
} from 'react-router-dom'
import posed, { PoseGroup } from 'react-pose'

import BaseContent from '../components/main-content/BaseContent'
import PageNotFound from '../components/common/error-pages/PageNotFound'

const RouteContainer = posed.div({
  enter: { opacity: 1, delay: 300, beforeChildren: true },
  exit: { opacity: 0 }
})

function MainContent () {
  return (
    <Route
      render={({ location }) => (
        <Row className='overflow-auto display-block'>
          <PoseGroup>
            <RouteContainer key={999999}>
              <Switch location={location}>
                <Route path="/" component={BaseContent} key="base" />
                <Route render={() => <PageNotFound />} key="notFound" />
              </Switch>
            </RouteContainer>
          </PoseGroup>
        </Row>
      )} />
  )
}

export default MainContent

import React from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Loader from '../common/Loader'

import fischerkarteLogo from '../../../assets/images/fischerkarte-logo.png'

class BaseContent extends React.Component {
  render() {
    return (
      <Row className='padding--sides width-100 height-100 background-offwhite'>
        <Col span={24} className='f48 center strong' >
          <img src={fischerkarteLogo} alt='fischerkarte-logo' />
          <Loader />
          <div style={{ marginBottom: 300 }}> Coming Soon ...</div>
        </Col>
      </Row>
    )
  }
}

BaseContent.propTypes = {
  base: PropTypes.object.isRequired,
}

const mapStateToProps = ({ base }) => {
  return {
    base
  }
}

export default connect(
  mapStateToProps, {
})(BaseContent)

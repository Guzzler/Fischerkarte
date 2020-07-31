import React from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


class BaseContent extends React.Component {
  render() {
    return (
      <Row className='padding--sides width-100 height-100 background-offwhite'>
        <Col span={24} className='f48 center strong' >
          Welcome to Fisher's Map - The Heatmap to show strengths and weaknesses at a particular chessboard position.
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

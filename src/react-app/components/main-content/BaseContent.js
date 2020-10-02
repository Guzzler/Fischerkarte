import React from 'react'
import { Row, Col, Button } from 'antd'
import { AppstoreAddOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../common/Loader'

import fischerkarteLogo from '../../../assets/images/fischerkarte-logo.png'

class BaseContent extends React.Component {
  render() {
    return (
      <Row className='padding--sides width-100 height-100 background-white'>
        <Col span={24} className='center' >
          <img src={fischerkarteLogo} alt='fischerkarte-logo' height={200} />
          <Loader />
          <div>
            <Link to='/new-game'>
              <Button type="primary" className='margin-half--ends margin--sides background-peach on-hover-light text-black' style={{ border: 0 }} shape="round" icon={<AppstoreAddOutlined />}>
                Start from New Game Position
              </Button>  
            </Link>
          </div>
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

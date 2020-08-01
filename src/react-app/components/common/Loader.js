import React from 'react'
import { Row, Col } from 'antd'

import chessBoardLoaderImage from '../../../assets/images/chessboard-loader.gif'
import loadingImage from '../../../assets/images/loader.gif'

const Loader = () => {
  return (
    <Row style={{ width: '100%' }}>
      <Col span={12} offset={6} style={{ position: 'relative ', height: 300 }} >
        <img src={chessBoardLoaderImage} alt='chessboard-loader' style={{position: 'absolute', left: '24%', opacity: 0.5 }} />
        <img src={loadingImage} alt='loading-text' width={150} height={150} style={{ position: 'absolute', left: '40%', top: '25%', zIndex: 2, opacity: 0.3 }}/>
      </Col>
    </Row>
  )
}

export default Loader

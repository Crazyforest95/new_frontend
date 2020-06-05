import React, { PureComponent, Fragment } from 'react'
import { Row, Col, Card, Typography } from 'antd'
import classes from './RequirementDetail.less';

const { Title, Text } = Typography

// cobra-55555 -20-04-19
class CountTracks extends PureComponent {
    render() {
      const {count_tracks, changeCountTrackSection} = this.props;
      return (
        <Card className={classes.countTrackCard}>
          <Row style={{textAlign: 'center'}}>
            {count_tracks.map((count_track, idx) => (
              <Col md={6} key={idx} className={idx + 1 < count_tracks.length ? classes.cardRightBorder : ''} onClick={() => changeCountTrackSection(idx)}>
                <Text style={{color: '#2979FF'}}>今日新增+{count_track.today}</Text>
                <Title level={2} className={classes.mV5}>{count_track.total}</Title>
                <Text>{count_track.type}</Text>
              </Col>
            ))}
          </Row>
        </Card>
      )
    }
}
// // // // //

export default CountTracks;
import React, { Fragment } from 'react';
import { message, Card, Row, Col, Checkbox, Typography, Button } from 'antd';
import { connect } from 'dva/index';
import classes from './RequirementDetail.less';

const { Title, Text } = Typography

@connect(({ engineer, loading }) => ({
  list: engineer.list,
  loading: loading.effects['engineer/getList'], // 是否加载loading
}))
class Resume extends React.Component {
  state = {
  };

  add = data => {
    const { dispatch, id, onSuccess } = this.props;
    dispatch({
      type: 'interview/add',
      payload: {
        offer_id: id,
        engineer_id: data.id,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
        } else {
          message.error('错误');
        }
        this.getList();
        onSuccess();
      },
    });
  };

  render() {
    const { list, loading } = this.props;

    // cobra-55555
    const { offer_data } = this.props;
    // // // // //

    // cobra-55555 -20-04-18
    return (
      <Card size="small">
        <Row>
          <Col md={12}>
            <Title level={2}>
              <Checkbox className={classes.checkBox}></Checkbox>
              <Text style={{color: '#2979FF'}}>{offer_data.name}</Text>
            </Title>
          </Col>
          <Col md={12} style={{textAlign: 'right'}}>
            <Title level={2}><Text style={{fontSize: 14}}>总成绩</Text>{offer_data.totalmark}</Title>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col md={12}>
            <Button type="primary" block>查看简历</Button>
          </Col>
          <Col md={12}>
            <Button type="primary" block>人员详情</Button>
          </Col>
        </Row>
      </Card>
    );
    // // // // //
  }
}

export default Resume;

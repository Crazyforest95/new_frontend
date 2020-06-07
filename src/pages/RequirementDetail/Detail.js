import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva';
import { Form, Card, Row, Col, Typography, Button, message } from 'antd'
import classes from './RequirementDetail.less';

import Upload from 'rc-upload';
import APP_CONFIG from '@/config';
import API from '@/api';
import { getToken } from '@/utils/authority';

const { Title, Text } = Typography;

@connect(({ requirementManagement, loading }) => ({
  // loading: loading.effects['requirementManagement/getDetail']
}))
@Form.create()

class Detail extends PureComponent {
  // 添加
  addoffer = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'requirementManagement/add',
      payload: {
        mode: 'offerData',
        ...data,
      },
      callback: datas => {
        if (datas) {
          message.success('上传成功');
          this.refreshPage();
        } else {
          message.error('错误');
        }
        this.getList();
      },
    });
  };

  refreshPage = () => {
    window.location.reload(false);
  }

  render() {
    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split("/");
    const offerid = array[array.length - 1];

    const { detail } = this.props;
    const token = getToken();
    const props = {
      action: `${APP_CONFIG.APP_HOST}${API.entryFileTemplate.upload}`,
      accept: '.pdf,.doc,.docx',
      headers: {
        Authorization: `Bearer ${token || ''}`,
        // Accept: 'application/json',
        mode: 'resume',
        offerID: offerid,
      },
      name: 'entry_file_template',
      onChange(file) {
        console.log(file)
      },
      onSuccess: (data) => {
        this.addoffer(data.result);
        // message.success(`上传成功`);
      },
      onError: () => {
        message.error(`上传失败`);
      },
    };

    return (
      <Fragment>
        {/* cobra-55555 -20-04-17 --- detail information box 1 */}
        <Title level={4} className={classes.cardBodyTitle}>1 基本信息</Title>
        <div className={classes.pB15}>
          <Row className={classes.p10}>
            <Col md={5}><Text>职位名称：{detail.position}</Text></Col>
            <Col md={5}><Text>职位类型: {detail.position_type}</Text></Col>
            <Col md={5}><Text>服务方式：{detail.service_method}</Text></Col>
            <Col md={5}><Text>公司：{detail.company}</Text></Col>
            <Col md={4}><Text>创建时间：{detail.created}</Text></Col>
          </Row>
          <Row className={classes.p10}>
            <Col md={5}><Text>工作地点：{detail.work_space}</Text></Col>
            <Col md={5}><Text>需求状态：{detail.status ? '进行中' : '已关闭'}</Text></Col>
          </Row>
        </div>
        {/* // // // // // */}

        <Title level={4} className={classes.cardBodyTitle}>2 职位要求</Title>
        <div className={classes.pB15}>
          <Row className={classes.p10}>
            <Col md={5}><Text>经验：{detail.experience}</Text></Col>
            <Col md={5}><Text>学历: {detail.education}</Text></Col>
            <Col md={5}><Text>薪资单价: {detail.unit_price}</Text></Col>
          </Row>
          <Row className={classes.p10}>
            <Col md={24}>
              <Text className={classes.m10}>职位描述:</Text>
              <div><Text>{detail.description}</Text></div>
            </Col>
          </Row>
        </div>

        <Title level={4} className={classes.cardBodyTitle}>3 招聘要求</Title>
        <div className={classes.pB15}>
          <Row className={classes.p10}>
            <Col md={24}>
              <Upload {...props}>
                <Text>委托代笔试：{detail.written_test}</Text>
                <Button size="small" type="primary" className={classes.mL20}>上传待面简历</Button>
              </Upload>
            </Col>
          </Row>
        </div>
      </Fragment>
    )
  }
}

export default Detail
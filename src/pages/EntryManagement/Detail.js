import React, { Fragment } from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';
import { connect } from 'dva/index';
import moment from 'moment';
import get from 'lodash/get';

const FormItem = Form.Item;

@connect(({ projectManagement, loading }) => ({
  list: projectManagement.list,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
class Detail extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    /*eslint-disable*/
    const {
      detail: { engineer = {}, pm = {}, start_date },
      detail,
      title,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    };
    return (
      <Fragment>
        <span onClick={this.showModal} style={{ color: '#1890FF' }}>
          {title}
        </span>
        <Modal
          title="入项信息"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={500}
          destroyOnClose
          maskClosable={false}
          footer={null}
        >
          <Form>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="姓名" {...formItemLayout}>
                  <Input value={engineer.real_name} readOnly />
                  <div style={{ color: 'red', marginLeft: '-54px' }}>
                    系统账号 {engineer.pre_username}
                  </div>
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="入项项目" {...formItemLayout}>
                  <Input value={detail.project} readOnly />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="项目经理" {...formItemLayout}>
                  <Input value={pm.real_name} readOnly />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="计费标准" {...formItemLayout}>
                  <Input value={detail.salary_type ? '按月计费' : '按日计费'} readOnly />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="职位" {...formItemLayout}>
                  <Input value={get(detail, 'position_level.position', '')} readOnly />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="级别" {...formItemLayout}>
                  <Input value={get(detail, 'position_level.name', '')} readOnly />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="单价" {...formItemLayout}>
                  <Input value={get(detail, 'position_level.money', '')} readOnly />
                </FormItem>
              </Col>
            </Row>
            {start_date && (
              <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
                <Col span={10} md={20} sm={18}>
                  <FormItem label="入项时间" {...formItemLayout}>
                    <Input value={moment(new Date(start_date)).format('YYYY年MM月DD日')} readOnly />
                  </FormItem>
                </Col>
              </Row>
            )}
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="工作地点" {...formItemLayout}>
                  <Input value={detail.work_place} readOnly />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default Detail;

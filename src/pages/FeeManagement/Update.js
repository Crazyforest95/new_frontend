import React, { Fragment } from 'react';
import { Modal, Form, Input, Row, Col, message } from 'antd';
import { connect } from 'dva/index';

import SkillTableForm from './component/LevelPriceTableForm';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  loading: loading.effects['requirementManagement/getList'], // 是否加载loading
}))
@Form.create()
class Update extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    const prop = this.props;
    const { details } = prop;
    /* eslint-disable */
    const { id, salary_type } = details;
    /* eslint-disable */
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = { id, salary_type, ...fieldsValue };
      this.add(sendParams);
    });
  };

  // 添加
  add = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionManagement/update',
      payload: {
        ...data,
        schema: 'PositionPutSchema',
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
          this.success();
        } else {
          message.error('错误');
        }
      },
    });
  };

  success = () => {
    const prop = this.props;
    const { resetFields } = prop.form;
    const { onSuccess } = this.props;

    onSuccess();
    this.setState({
      visible: false,
    });
    resetFields();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const prop = this.props;
    const { way, details, onSuccess } = prop;
    const { getFieldDecorator } = prop.form;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: {
        md: { span: 5 },
      },
      wrapperCol: {
        md: { span: 16 },
      },
    };
    return (
      <Fragment>
        <span>
          <a onClick={this.showModal}>编辑</a>
        </span>
        <Modal
          title="编辑"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
          destroyOnClose
          maskClosable={false}
        >
          <Form>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={24}>
                <FormItem label="职位名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: details.name,
                    rules: [
                      {
                        required: true,
                        message: '职位名称不可为空',
                      },
                      {
                        max: 16,
                        message: '职位名称最大长度为16',
                      },
                    ],
                  })(<Input placeholder="请输入职位名称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={24}>
                <FormItem label="价格级别信息" {...formItemLayout}>
                  {getFieldDecorator('position_levels', {
                    initialValue: details.position_levels.map(i => ({ ...i, key: i.id })),
                  })(
                    <SkillTableForm
                      positionId={details.id}
                      way={way}
                      isFunc={true}
                      onSuccess={onSuccess}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default Update;

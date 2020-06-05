import React, { Fragment } from 'react';
import { Modal, Button, Form, Input, Row, Col, message } from 'antd';
import { connect } from 'dva/index';

import SkillTableForm from './component/LevelPriceTableForm';

const FormItem = Form.Item;

@connect(({ projectManagement, loading }) => ({
  username: projectManagement.username,
  loading: loading.effects['requirementManagement/getList'], // 是否加载loading
}))
@Form.create()
class Add extends React.Component {
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
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = { ...fieldsValue };
      this.add(sendParams);
    });
  };

  // 添加
  add = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectManagement/add',
      payload: {
        ...data,
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
    const { way } = this.props;
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
          <Button type="primary" icon="plus-circle" onClick={this.showModal}>
            增加
          </Button>
        </span>
        <Modal
          title="增加"
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
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('real_name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入客户姓名',
                      },
                    ],
                  })(<Input placeholder="请输入客户姓名" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={24}>
                <FormItem label="价格级别信息" {...formItemLayout}>
                  {getFieldDecorator('abilities', {
                    initialValue: [{ price: 12, level: 33 }],
                    rules: [
                      {
                        required: true,
                        message: '请添加价格级别信息',
                      },
                    ],
                  })(<SkillTableForm way={way} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default Add;

import React, { Fragment } from 'react';
import { Modal, Form, Input, Row, Col, message } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;

@connect(({ projectManagement }) => ({
  detail: projectManagement.detail,
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
    this.details();
  };

  details = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'projectManagement/getDetail',
      payload: { id },
    });
  };

  handleOk = () => {
    const { id } = this.props;
    const prop = this.props;
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = {
        ...fieldsValue,
        id,
        schema: 'PmPutSchema',
      };
      this.update(sendParams);
    });
  };

  // 修改
  update = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectManagement/update',
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

  success = async () => {
    const prop = this.props;
    const { resetFields } = prop.form;
    const { onSuccess } = this.props;

    await this.setState({
      visible: false,
    });
    await resetFields();
    await onSuccess();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const prop = this.props;
    const { detail } = prop;
    const { getFieldDecorator } = prop.form;
    const { visible } = this.state;
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
        <a onClick={this.showModal} style={{ color: '#1890FF' }}>
          编辑
        </a>
        <Modal
          title="编辑"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={500}
          destroyOnClose
          maskClosable={false}
        >
          <Form>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('real_name', {
                    rules: [
                      {
                        required: true,
                        message: '姓名不可为空',
                      },
                      {
                        max: 10,
                        message: '姓名最大长度为10',
                      },
                    ],
                    initialValue: detail.real_name,
                  })(<Input placeholder="请输入客户姓名" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="电话" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: '电话不可为空',
                      },
                      {
                        message: '请输入正确电话号码',
                        pattern: /^1[3456789]\d{9}$/,
                      },
                    ],
                    initialValue: detail.phone,
                  })(<Input placeholder="请输入电话号码" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="邮箱" {...formItemLayout}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: '邮箱不可为空',
                      },
                      {
                        message: '请输入正确邮箱',
                        pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                      },
                    ],
                    initialValue: detail.email,
                  })(<Input placeholder="请输入邮箱" maxLength={64} />)}
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

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Row, Col, message } from 'antd';

const FormItem = Form.Item;

@connect()
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
    const { data } = this.props;
    const prop = this.props;
    const { validateFields, setFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.new_password !== fieldsValue.new_password_again) {
        setFields({
          new_password_again: {
            value: fieldsValue.new_password_again,
            errors: [new Error('两次输入不一致')],
          },
        });

        return;
      }
      const sendParam = { new_password: fieldsValue.new_password, user_id: data.id };
      this.changePassword(sendParam);
    });
  };

  // 修改
  changePassword = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/changePassword',
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
        <a onClick={this.showModal}>修改密码</a>
        <Modal
          title="修改密码"
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
                <FormItem label="新密码" {...formItemLayout}>
                  {getFieldDecorator('new_password', {
                    rules: [
                      {
                        required: true,
                        message: '新密码不能为空',
                      },
                      {
                        message: '密码必须是8-16位的字母、数字组合（以字母开头）',
                        pattern: /^([A-Za-z])(?![a-zA-Z]+$)[0-9A-Za-z]{7,15}$/,
                      },
                    ],
                  })(<Input placeholder="请输入8-16位的字母与数字组合" type="password" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="确认密码" {...formItemLayout}>
                  {getFieldDecorator('new_password_again', {
                    rules: [
                      {
                        required: true,
                        message: '5-15位数字或字母的用户名',
                      },
                    ],
                  })(<Input placeholder="请输入8-16位的字母与数字组合" type="password" />)}
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

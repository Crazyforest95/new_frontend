import React, { Fragment } from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item;

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
    const { changePassword, data } = this.props;
    const prop = this.props;
    const { validateFields, resetFields, setFields } = prop.form;
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
      resetFields();
      const sendParam = { new_password: fieldsValue.new_password, user_id: data.id };
      changePassword(sendParam);
      this.setState({
        visible: false,
      });
    });
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
        <a onClick={this.showModal} style={{ color: '#1890FF' }}>
          修改密码
        </a>
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
                <FormItem label="再输入一次" {...formItemLayout}>
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

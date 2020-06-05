import React, { Fragment } from 'react';
import { Modal, Icon, Form, Input, Row, Col, message } from 'antd';
import { connect } from 'dva/index';

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
      if (prop && prop.id) {
        sendParams.project_id = prop.id;
      }
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
        <span>
          <Icon type="plus-circle" onClick={this.showModal} />
        </span>
        <Modal
          title="增加"
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
                  })(<Input placeholder="请输入姓名" />)}
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
                        // pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
                        pattern: /^1[3456789]\d{9}$/,
                      },
                    ],
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
                  })(<Input placeholder="请输入邮箱" maxLength={64} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="&nbsp;" colon={false} {...formItemLayout}>
                  默认密码：nk123456
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

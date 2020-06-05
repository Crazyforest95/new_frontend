import React, { Fragment } from 'react';
import { Modal, Icon, Form, Input, Row, Col, message } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;

@connect(({ projectManagement, loading }) => ({
  list: projectManagement.list,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
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
      type: 'projects/add',
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
                <FormItem label="项目名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        message: '项目名称不可为空',
                        required: true,
                      },
                      {
                        max: 16,
                        message: '项目名称最大长度为16',
                      },
                    ],
                  })(<Input placeholder="请输入项目名称" />)}
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

import React, { Fragment } from 'react';
import { Modal, Radio, Form, Row, Col, Input, message } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
@connect(({ engineer, loading }) => ({
  list: engineer.list,
  loading: loading.effects['engineer/getList'], // 是否加载loading
}))
class Close extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  close = item => {
    const { dispatch, id, onSuccess } = this.props;
    const sendData = {
      ...item,
      schema: 'OfferShutDownSchema',
      id,
    };
    dispatch({
      type: 'requirementManagement/close',
      payload: {
        ...sendData,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
          onSuccess();
          this.setState({
            visible: false,
          });
        } else {
          message.error('错误');
        }
      },
    });
  };

  handleOk = () => {
    const prop = this.props;
    const { validateFields, resetFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      this.close(fieldsValue);
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
        <a type="primary" onClick={this.showModal}>
          关闭
        </a>
        <Modal
          title="关闭"
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
                <FormItem label="关闭原因" {...formItemLayout}>
                  {getFieldDecorator('shut_down_reason', {
                    rules: [
                      {
                        required: true,
                        message: '关闭原因',
                      },
                    ],
                  })(
                    <RadioGroup>
                      <Radio value="project_change">项目变动</Radio>
                      <Radio value="finished">人员已够</Radio>
                      <Radio value="others">其他原因</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="描述" {...formItemLayout}>
                  {getFieldDecorator('shut_down_note', {
                    rules: [
                      {
                        message: '请填写关闭需求原因',
                      },
                    ],
                  })(<TextArea rows={4} placeholder="请填写关闭需求原因" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default Close;

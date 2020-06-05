import React, { Fragment } from 'react';
import { Modal, Form, Input, Row, Col, message } from 'antd';
import { connect } from 'dva/index';

import SkillTableForm from './component/LevelPriceTableForm';

const FormItem = Form.Item;

@connect(({ projectManagement, loading }) => ({
  username: projectManagement.username,
  loading: loading.effects['requirementManagement/getList'], // 是否加载loading
}))
@Form.create()
class Add extends React.Component {
  static defaultProps = {
    text: '增加',
    way: '日',
  };

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
    const { way } = prop;
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = { ...fieldsValue, salary_type: way === '日' ? 0 : 1 };
      this.add(sendParams);
    });
  };

  // 添加
  add = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionManagement/add',
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
    const { way, text } = this.props;
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
        <span onClick={this.showModal}>{text}</span>
        <Modal
          title={`增加${way}报价单`}
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
                    initialValue: [],
                  })(<SkillTableForm way={way} isFunc={false} />)}
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

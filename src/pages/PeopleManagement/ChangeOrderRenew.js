import React from 'react';
import { connect } from 'dva/index';

import { Modal, Form, Radio, message, Alert } from 'antd';
// import AddProjet from './AddProjet';
import styled from 'styled-components';
import { update } from '@/services/careers';

const Text = styled.h5`
  text-align: center;
  :hover {
    color: #1890ff;
  }
`;

@connect(({ menu, loading }) => ({
  companyId: menu.companyId,
  loading: loading.effects['LevelManagement/add'], // 是否加载loading
}))
@Form.create()
class Add extends React.Component {
  state = {
    visible: false,
    submitting: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    const {
      form: { validateFields },
      id,
    } = this.props;
    validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      /* eslint-disable */
      const sendParams = {
        id,
        schema: 'OrderRenewMethodSchema',
        ...fieldsValue,
      };
      this.add(sendParams);
      /* eslint-enable */
    });
  };

  // 添加
  add = data => {
    this.setState({
      submitting: true,
    });
    update(data).then(res => {
      this.setState({
        submitting: false,
      });
      if (res) {
        this.success(res);
        message.success('提交成功');
      } else {
        message.error('错误');
      }
    });
  };

  success = async () => {
    const prop = this.props;
    const { resetFields } = prop.form;
    const { onSuccess } = this.props;
    await resetFields();
    await onSuccess();
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      authRenew,
      renewCycle,
      text,
    } = this.props;
    const { visible, submitting } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 18 },
      },
    };
    return (
      <>
        <Text onClick={this.showModal}>{text}</Text>
        <Modal
          title="切换采购订单签约形式"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
          maskClosable={false}
          confirmLoading={submitting}
        >
          <Form>
            <Form.Item {...formItemLayout} label="续费方式">
              {getFieldDecorator('auto_renew', {
                initialValue: authRenew,
                rules: [{ required: true, message: '请输入转账金额' }],
              })(
                <Radio.Group name="radiogroup">
                  <Radio value={0}>自动续签</Radio>
                  <Radio value={1}>手动续签</Radio>
                </Radio.Group>
              )}
              {getFieldValue('auto_renew') === 0 && (
                <Alert
                  description="提示：当前采购订单剩余15天时自动续签下一份采购订单"
                  type="info"
                />
              )}
            </Form.Item>
            {getFieldValue('auto_renew') === 0 && (
              <Form.Item {...formItemLayout} label="续费时间">
                {getFieldDecorator('renew_cycle', {
                  initialValue: renewCycle,
                  rules: [{ required: true, message: '请输入转账金额' }],
                })(
                  <Radio.Group name="radiogroup">
                    <Radio value={3}>3个月</Radio>
                    <Radio value={6}>6个月</Radio>
                    <Radio value={12}>1年</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            )}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Add;

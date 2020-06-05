import React, { Fragment } from 'react';
import { Modal, Button, Form, Row, Col, Select, Alert, message } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ projectManagement, menu, loading }) => ({
  list: projectManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
@Form.create()
class ChangeProject extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.getPM();
  };

  getPM = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'projectManagement/getList',
      payload: {
        company_id: companyId,
        sort_id: -1,
        page: 1,
        per_page: 1000,
        activate: 1,
      },
    });
  };

  handleOk = () => {
    const prop = this.props;
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = { ...fieldsValue, company_id: prop.companyId };
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
    const { list } = prop;
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
          <Button type="primary" onClick={this.showModal}>
            移项
          </Button>
        </span>
        <Modal
          title="移项"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={500}
          destroyOnClose
          maskClosable={false}
        >
          <Alert message="已选择需求分析项目中的28人" type="success" />
          <Form>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="项目" {...formItemLayout}>
                  {getFieldDecorator('gender', {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目经理',
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择项目经理">
                      {list.data.map(i => (
                        <Option value={i.id}>{i.real_name}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="项目经理" {...formItemLayout}>
                  {getFieldDecorator('gender', {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目经理',
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择项目经理">
                      {list.data.map(i => (
                        <Option value={i.id}>{i.real_name}</Option>
                      ))}
                    </Select>
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

export default ChangeProject;

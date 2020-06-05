import React, { Fragment } from 'react';
import { Modal, Form, Row, Col, Select, message } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ projects, menu, loading }) => ({
  detail: projects.detail,
  companyId: menu.companyId,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
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
    // this.getPM();
  };

  getPM = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'projectManagement/getList',
      payload: {
        sort_id: -1,
        page: 1,
        per_page: 1000,
        activate: 1,
        project_id: id,
      },
    });
  };

  handleOk = () => {
    const {
      pms = {},
      form: { validateFields },
      engineerId,
    } = this.props;
    const { id } = pms;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = {
        ...fieldsValue,
        old_pm_id: id,
        schema: 'EngineerChangePmSchema',
        id: engineerId,
      };
      this.add(sendParams);
    });
  };

  // 添加
  add = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'engineer/update',
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

    this.setState({
      visible: false,
    });
    onSuccess();
    resetFields();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      detail: { pms_engineers = [] }, // eslint-disable-line
      pms = {},
      form: { getFieldDecorator },
    } = this.props; // eslint-disable-line
    const { id } = pms; // eslint-disable-line
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
          <a onClick={this.showModal}>更换项目经理</a>
        </span>
        <Modal
          title="更换项目经理"
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
                <FormItem label="项目经理" {...formItemLayout}>
                  {getFieldDecorator('new_pm_id', {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目经理',
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择项目经理">
                      {pms_engineers
                        .filter(i => i.id !== id)
                        .map(i => (
                          <Option key={i.id} value={i.id}>
                            {i.real_name}
                          </Option>
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

export default Update;

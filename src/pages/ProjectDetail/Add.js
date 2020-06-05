import React, { Fragment } from 'react';
import { Modal, Icon, Form, Row, Col, Select, Alert, message } from 'antd';
import { connect } from 'dva/index';
import findIndex from 'lodash/findIndex';
import { setPm } from '@/services/projects';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ projectManagement, menu, loading }) => ({
  list: projectManagement.list,
  companyId: menu.companyId,
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
      const sendParams = { ...fieldsValue, id: prop.id, schema: 'ProjectAddPmSchema' };
      this.add(sendParams);
    });
  };

  // 添加
  add = data => {
    setPm(data).then(datas => {
      if (datas) {
        message.success('提交成功');
        this.success();
      } else {
        message.error('错误');
      }
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
    const { list, choosedPm } = prop;
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
          {list.data && !list.data.length && (
            <Alert message="请先创建项目经理号，再创建项目" type="warning" showIcon />
          )}
          <Form>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="项目经理" {...formItemLayout}>
                  {getFieldDecorator('pm_id', {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目经理',
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择项目经理">
                      {list.data
                        .filter(i => findIndex(choosedPm, ['id', i.id]) === -1)
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

export default Add;

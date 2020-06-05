import React, { Fragment } from 'react';
import { Modal, Form, Row, Col, Select, message, Button, Alert } from 'antd';
import { connect } from 'dva/index';
import { changePm } from '@/services/projects';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ projects, menu, loading }) => ({
  detail: projects.detail,
  companyId: menu.companyId,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
@Form.create()
class ProjectChangePm extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    // this.getPM();
  };

  handleOk = () => {
    const {
      pms = {},
      form: { validateFields },
      projectId,
    } = this.props;
    const { id } = pms;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = {
        ...fieldsValue,
        old_pm_id: id,
        schema: 'ProjectChangePmSchema',
        id: projectId,
      };
      this.changePm(sendParams);
    });
  };

  changePm = data => {
    changePm(data).then(res => {
      if (res) {
        message.success('交接成功');
      } else {
        message.error('错误');
      }
      this.success();
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
      form: { getFieldDecorator },
      pms: { real_name, id }, // eslint-disable-line
    } = this.props; // eslint-disable-line
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
    /* eslint-disable */
    return (
      <Fragment>
        <span>
          <Button type="primary" onClick={this.showModal}>
            业务交接
          </Button>
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
            <Alert message={`需求分析项目中${real_name}的业务交接给`} type="success" />
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

export default ProjectChangePm;

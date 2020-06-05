import React from 'react';
import { connect } from 'dva/index';
import { Modal, Form, Input, Row, Col, Select, InputNumber } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(
  ({
    projects,
    menu,
    loading,
    positionManagement,
    levelManagement,
    projectManagement,
    requirementManagement,
  }) => ({
    projects: projects.list.data,
    position: positionManagement.list.data,
    level: levelManagement.list.data,
    projectManagement: projectManagement.list.data,
    detail: requirementManagement.detail,
    companyId: menu.companyId,
    loading: loading.effects['requirementManagement/getDetail'], // 是否加载loading
  })
)
@Form.create()
class Detail extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.getProjects();
  };

  getProjects = () => {
    const { dispatch, companyId, id } = this.props;
    dispatch({
      type: 'projects/getList',
      payload: { company_id: companyId },
    });
    dispatch({
      type: 'levelManagement/getList',
      payload: { company_id: companyId },
    });
    dispatch({
      type: 'positionManagement/getList',
      payload: { company_id: companyId },
    });
    dispatch({
      type: 'projectManagement/getList',
      payload: { company_id: companyId },
    });
    dispatch({
      type: 'requirementManagement/getDetail',
      payload: { company_id: companyId, id },
    });
  };

  handleOk = () => {
    const { update, id } = this.props;
    const prop = this.props;
    const { validateFields, resetFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      const sendParams = {
        ...fieldsValue,
        company_id: prop.companyId,
        id,
        schema: 'OfferModifySchema',
      };
      update(sendParams);
      this.setState({
        visible: false,
      });
    });
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  PMchange = id => {
    const { projectManagement } = this.props;
    const prop = this.props;
    const { setFieldsValue } = prop.form;
    const selectPM = projectManagement.filter(item => item.id === id);
    setFieldsValue({
      phone: selectPM[0].phone,
      email: selectPM[0].email,
    });
  };

  render() {
    const prop = this.props;
    const { projects, position, level, projectManagement } = prop;
    const { detail } = prop;
    const { getFieldDecorator } = prop.form;
    const { visible } = this.state;
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
    const textAreaLayout = {
      labelCol: {
        sm: { span: 20 },
        md: { span: 3 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 21 },
      },
    };
    return (
      <span>
        <a onClick={this.showModal}>详情</a>
        <Modal
          title="详情"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          destroyOnClose
          footer={null}
        >
          <Form>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={12} sm={18}>
                <FormItem label="需求名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入需求名称',
                        // max:16,
                        // min:6
                      },
                    ],
                    initialValue: detail.name,
                  })(<Input placeholder="请输入需求名称" type="text" readOnly />)}
                </FormItem>
              </Col>
              <Col span={10} md={12} sm={18}>
                <FormItem label="职位" {...formItemLayout}>
                  {getFieldDecorator('position_id', {
                    rules: [
                      {
                        required: true,
                        message: '请选择职位',
                      },
                    ],
                    initialValue: detail.position_id,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择职位" disabled>
                      {position.map(each => {
                        return <Option value={each.id}>{each.name}</Option>;
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={12} sm={18}>
                <FormItem label="级别" {...formItemLayout}>
                  {getFieldDecorator('position_level_id', {
                    rules: [
                      {
                        required: true,
                        message: '请选择级别',
                      },
                    ],
                    initialValue: detail.position_level_id,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择级别" disabled>
                      {level.map(each => {
                        return <Option value={each.id}>{each.name}</Option>;
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10} md={12} sm={18}>
                <FormItem label="需求人数" {...formItemLayout}>
                  {getFieldDecorator('amount', {
                    rules: [
                      {
                        required: true,
                        message: '请输入需求人数',
                      },
                      {
                        message: '需求人数不能为负数',
                        pattern: /^\d+(\.\d+)?$/,
                      },
                      {
                        pattern: /^\+?[1-9][0-9]*$/,
                        message: '需求人数必须为正整数',
                      },
                    ],
                    initialValue: detail.amount,
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      placeholder="请输入需求人数"
                      readOnly
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={12} sm={18}>
                <FormItem label="项目名称" {...formItemLayout}>
                  {getFieldDecorator('project_id', {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目名称',
                      },
                    ],
                    initialValue: detail.project_id,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择项目名称" disabled>
                      {projects.map(each => {
                        return <Option value={each.id}>{each.name}</Option>;
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10} md={12} sm={18}>
                <FormItem label="项目经理" {...formItemLayout}>
                  {getFieldDecorator('pm_id', {
                    rules: [
                      {
                        required: true,
                        message: '请选择项目经理',
                      },
                    ],
                    initialValue: detail.pm_id,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择项目经理" disabled>
                      {projectManagement.map(each => {
                        return <Option value={each.id}>{each.real_name}</Option>;
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={12} sm={18}>
                <FormItem label="电话" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: '请输入电话号码',
                      },
                      {
                        message: '请输入正确电话号码',
                        pattern: /^1[3456789]\d{9}$/,
                      },
                    ],
                    initialValue: detail.pm && detail.pm.phone,
                  })(<Input placeholder="请输入电话" readOnly />)}
                </FormItem>
              </Col>
              <Col span={10} md={12} sm={18}>
                <FormItem label="邮箱" {...formItemLayout}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        message: '请输入正确邮箱',
                        pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                      },
                    ],
                    initialValue: detail.pm && detail.pm.email,
                  })(<Input placeholder="请输入邮箱" readOnly maxLength={64} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col md={24} sm={18}>
                <FormItem label="需求详情" {...textAreaLayout}>
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: '请输入' }],
                    initialValue: detail.description,
                  })(<TextArea autosize={{ minRows: 10, maxRows: 20 }} readOnly />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Detail;

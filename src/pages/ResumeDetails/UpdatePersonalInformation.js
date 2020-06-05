import React from 'react';
import { Modal, Button, Form, Input, Row, Col, Select, InputNumber } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;
const { Option } = Select;

const gender = {
  男: 1,
  女: 0,
};

const jobWantedStatus = {
  positive: '积极找工作',
  negative: '暂时不换工作',
  neutral: '随便看看',
};

const status = {
  ready: '待选',
  interview: '面试中',
  on_duty: '在职',
};

@Form.create()
@connect(({ engineer, menu, loading, positionManagement, levelManagement }) => ({
  detail: engineer.detail,
  companyId: menu.companyId,
  position: positionManagement.list.data,
  level: levelManagement.list.data,
  loading: loading.effects['quotesManagement/add'], // 是否加载loading
}))
class UpdatePersonalInformation extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.details();
  };

  details = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'levelManagement/getList',
      payload: {
        company_id: companyId,
      },
    });
    dispatch({
      type: 'positionManagement/getList',
      payload: {
        company_id: companyId,
      },
    });
  };

  handleOk = () => {
    const { update, id } = this.props;
    const prop = this.props;
    const { validateFields, resetFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      const params = {
        ...fieldsValue,
        welfare_rate: fieldsValue.welfare_rate,
        id,
        schema: 'EngineerPutSchema',
      };
      update(params);
      this.setState({
        visible: false,
      });
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
    const { level, position, detail } = prop;
    /* eslint-disable */ const { abilities = [], education = [], now_career } = detail;
    const { offer = { pm: {} } } = now_career || { offer: { pm: {} } };
    const { pm = {} } = offer;
    /* eslint-enable */
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
      <span>
        <div>
          <Button icon="edit" type="primary" onClick={this.showModal}>
            编辑
          </Button>
        </div>
        <Modal
          title="编辑"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          destroyOnClose
          maskClosable={false}
        >
          <Form>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={10} sm={18}>
                <FormItem label="客户姓名" {...formItemLayout}>
                  {getFieldDecorator('real_name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                    initialValue: detail.real_name,
                  })(<Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>
              <Col span={10} md={10} sm={18}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('gender', {
                    rules: [
                      {
                        required: true,
                        message: '请选择性别',
                        // max:16,
                        // min:6
                      },
                    ],
                    initialValue: detail.gender,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择性别">
                      {Object.keys(gender).map(key => (
                        <Option key={key} value={gender[key]}>
                          {key}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={10} sm={18}>
                <FormItem label="求职状态" {...formItemLayout}>
                  {getFieldDecorator('job_wanted_status', {
                    rules: [
                      {
                        required: true,
                        message: '请输入地址',
                      },
                    ],
                    initialValue: detail.job_wanted_status,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {Object.keys(jobWantedStatus).map(key => (
                        <Option key={key} value={key}>
                          {jobWantedStatus[key]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10} md={10} sm={18}>
                <FormItem label="职位" {...formItemLayout}>
                  {getFieldDecorator('position', {
                    initialValue: offer.position,
                  })(
                    <Select style={{ width: '100%' }} placeholder="无" disabled>
                      {position.map(each => {
                        return (
                          <Option key={each.id} value={each.id}>
                            {each.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={10} sm={18}>
                <FormItem label="级别" {...formItemLayout}>
                  {getFieldDecorator('position_level_id', {
                    initialValue: offer.position_level,
                  })(
                    <Select style={{ width: '100%' }} placeholder="无" disabled>
                      {level.map(each => {
                        return (
                          <Option key={each.id} value={each.id}>
                            {each.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10} md={10} sm={18}>
                <FormItem label="单价" {...formItemLayout}>
                  {getFieldDecorator('money', {
                    initialValue: offer.money,
                  })(<Input placeholder="无" readOnly disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={10} sm={18}>
                <FormItem label="银行账号" {...formItemLayout}>
                  {getFieldDecorator('bank_code', {
                    rules: [
                      {
                        message: '请输入',
                        pattern: /^(0|[1-9]\d*)\b/,
                      },
                    ],
                    initialValue: detail.bank_code,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={10} md={10} sm={18}>
                <FormItem label="代缴福利" {...formItemLayout}>
                  {getFieldDecorator('pay_welfare', {
                    initialValue: detail.pay_welfare,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value={1}>是</Option>
                      <Option value={2}>否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={10} sm={18}>
                <FormItem label="系统账号" {...formItemLayout}>
                  {getFieldDecorator('pre_username', {
                    initialValue: detail.pre_username,
                  })(<Input placeholder="请输入" readOnly disabled />)}
                </FormItem>
              </Col>
              <Col span={10} md={10} sm={18}>
                <FormItem label="账号状态" {...formItemLayout}>
                  {getFieldDecorator('activate', {
                    rules: [
                      {
                        required: true,
                        message: '请选择系统账号状态',
                      },
                    ],
                    initialValue: detail.activate,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value={0}>禁用</Option>
                      <Option value={1}>正常</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={10} sm={18}>
                <FormItem label="社保基数" {...formItemLayout}>
                  {getFieldDecorator('welfare_rate', {
                    initialValue: detail.welfare_rate,
                  })(<InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} />)}
                </FormItem>
              </Col>
              <Col span={10} md={10} sm={18}>
                <FormItem label="工作状态" {...formItemLayout}>
                  {getFieldDecorator('status', {
                    rules: [
                      {
                        required: true,
                        message: '请输入地址',
                      },
                    ],
                    initialValue: detail.status,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {Object.keys(status).map(key => (
                        <Option key={key} value={key}>
                          {status[key]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={10} sm={18}>
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
                    initialValue: detail.phone,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={10} md={10} sm={18}>
                <FormItem label="邮箱" {...formItemLayout}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                        pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                      },
                    ],
                    initialValue: detail.email,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={10} md={10} sm={18}>
                <FormItem label="合同确认" {...formItemLayout}>
                  {getFieldDecorator('contract_confirm', {
                    initialValue: detail.contract_confirm,
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value={1}>已确认</Option>
                      <Option value={2}>未确认</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default UpdatePersonalInformation;

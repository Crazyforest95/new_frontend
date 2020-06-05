import React, { Fragment } from 'react';
import moment from 'moment';
import { Modal, Button, Form, Input, Row, Col, DatePicker } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class Resignation extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    const { resignation, detail } = this.props;
    const prop = this.props;
    const { validateFields, resetFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      const param = {
        ...fieldsValue,
        engineer_id: detail.id,
        date: moment(fieldsValue.date).format('YYYY-MM-DD'),
      };
      resignation(param);
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

  disabledDate = current => {
    return current && current < moment().endOf('day');
  };

  render() {
    const prop = this.props;
    const { detail } = this.props;
    /* eslint-disable */
    const { now_career = {} } = detail;
    const { interview = {} } = now_career || {};
    /* eslint-disable */
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
        <Button type="primary" onClick={this.showModal}>
          申请离职
        </Button>
        <Modal
          title="离职申请"
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
                <FormItem label="姓名" {...formItemLayout}>
                  {detail.real_name}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="所在项目" {...formItemLayout}>
                  {detail.project}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="职位" {...formItemLayout}>
                  {interview.position}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="级别" {...formItemLayout}>
                  {interview.position_level_id}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="离职时间" {...formItemLayout}>
                  {getFieldDecorator('date', {
                    rules: [
                      {
                        required: true,
                        message: '请选择时间',
                      },
                    ],
                  })(
                    <DatePicker
                      disabledDate={this.disabledDate}
                      style={{ width: '100%' }}
                      showToday={false}
                      getCalendarContainer={e => e}
                      placeholder="请选择时间"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="离职原因" {...formItemLayout}>
                  {getFieldDecorator('reason', {
                    rules: [
                      {
                        required: true,
                        message: '请输入离职原因',
                      },
                    ],
                  })(<TextArea rows={4} placeholder="请输入离职原因" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default Resignation;

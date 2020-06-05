import React, { Fragment } from 'react';
import { Modal, Button, Form, Row, Col, Select, Icon, DatePicker } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class ChangeResult extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    // const { add } = this.props;
    // const prop = this.props;
    // const { validateFields, resetFields } = prop.form;
    // validateFields((err, fieldsValue) => {
    //   if (err) return;
    //   resetFields();
    //   add(fieldsValue);
    //   this.setState({
    //     visible: false,
    //   });
    // });
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
        <Button size="small" type="primary" onClick={this.showModal}>
          <Icon type="edit" />
        </Button>
        <Modal
          title="修改"
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
                <FormItem label="状态" {...formItemLayout}>
                  {getFieldDecorator('username', {
                    rules: [
                      {
                        required: true,
                        message: '5-15位数字或字母的用户名',
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      <Option value="1">待面</Option>
                      <Option value="2">入职</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
              <Col span={10} md={20} sm={18}>
                <FormItem label="时间" {...formItemLayout}>
                  {getFieldDecorator('username', {
                    rules: [
                      {
                        required: true,
                        message: '5-15位数字或字母的用户名',
                      },
                    ],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default ChangeResult;

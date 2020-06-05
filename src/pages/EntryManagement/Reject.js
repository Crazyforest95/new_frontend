import React, { Fragment } from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';

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
    const { onClick, id } = this.props;
    const prop = this.props;
    const { validateFields, resetFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      const param = {
        ...fieldsValue,
        id,
        yes_or_no: 0,
      };
      onClick(param);
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
        <a onClick={this.showModal}>驳回</a>
        <Modal
          title="驳回"
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
                <FormItem label="驳回理由" {...formItemLayout}>
                  {getFieldDecorator('comment', {
                    rules: [
                      {
                        required: true,
                        message: '出项原因不可为空',
                      },
                      {
                        max: 100,
                        message: '出项原因最大长度为100',
                      },
                    ],
                  })(<TextArea rows={4} placeholder="请输入出项原因" />)}
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

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Row, Col, message } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;

@connect(({ projectManagement, loading }) => ({
  list: projectManagement.list,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
@Form.create()
class Update extends React.Component {
  static defaultProps = {
    name: '',
    id: '',
  };

  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
  };

  state = {
    visible: false,
  };

  stopPropagation = e => {
    if (e && e.stopPropagation) {
      // 因此它支持W3C的stopPropagation()方法
      e.stopPropagation();
    } else {
      // 否则，我们需要使用IE的方式来取消事件冒泡
      window.event.cancelBubble = true;
    }
  };

  showModal = e => {
    this.stopPropagation(e);
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    const prop = this.props;
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = { ...fieldsValue, id: prop.id, schema: 'ProjectPutSchema' };
      this.update(sendParams);
    });
  };

  // 添加
  update = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/update',
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
      <span onClick={e => this.stopPropagation(e)}>
        <span>
          <a onClick={e => this.showModal(e)}>编辑</a>
        </span>
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
                <FormItem label="项目名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: prop.name,
                    rules: [
                      {
                        message: '项目名称不可为空',
                        required: true,
                      },
                      {
                        max: 16,
                        message: '项目名称最大长度为16',
                      },
                    ],
                  })(<Input placeholder="请输入项目名称" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Update;

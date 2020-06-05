import React, { Fragment } from 'react';
import { Modal, Button, Form, Input, Row, Col, message } from 'antd';
import { connect } from 'dva/index';
import styles from './style.less';

const FormItem = Form.Item;

@connect(({ menu, loading }) => ({
  companyId: menu.companyId,
  loading: loading.effects['LevelManagement/add'], // 是否加载loading
}))
@Form.create()
class AddProjet extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  add = data => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'projects/add',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
        } else {
          message.error('错误');
        }
        dispatch({
          type: 'projects/getList',
          payload: { company_id: companyId },
        });
      },
    });
  };

  handleOk = () => {
    const { companyId } = this.props;
    const prop = this.props;
    const { validateFields, resetFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      const addParams = {
        ...fieldsValue,
        company_id: companyId,
      };
      this.add(addParams);
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
        <Button
          className={styles.inputButton}
          type="primary"
          icon="plus-circle"
          onClick={this.showModal}
        >
          新建项目
        </Button>
        <Modal
          title="新建项目"
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
                    rules: [
                      {
                        message: '请输入项目名称',
                        required: true,
                      },
                      {
                        message: '名称过长',
                        max: 16,
                        // min:6
                      },
                    ],
                  })(<Input placeholder="请输入项目名称" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default AddProjet;

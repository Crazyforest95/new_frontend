import React, { Fragment } from 'react';
import { Modal, Form, Row, Col, Alert, message, Button } from 'antd';
import { connect } from 'dva/index';
import { getList, active } from '@/services/projectManagement';

const FormItem = Form.Item;

const warringText =
  '当前账号下有人员，暂不能禁用账号。请将该项目经理所管全部工程师转移到其他项目中，即可禁用该账号';
const successText =
  '当前账号下没有人员，可以点击下方按钮禁用此账号';

@connect(({ projectManagement, menu, loading }) => ({
  list: projectManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
@Form.create()
class IsEnabled extends React.Component {
  state = {
    visible: false,
    projectList: [],
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.getPM();
  };

  getPM = () => {
    const { id } = this.props;

    const params = {
      schema: 'PmDeleteInfo',
      id,
    };
    getList(params).then(res => {
      this.setState({
        projectList: res.data[0].project || [],
      });
    });
  };

  handleOk = () => {
    const { id, activate } = this.props;
    this.enabled(id, !activate);
  };

  // 启用禁用
  enabled = () => {
    const { activate, id } = this.props;

    const sendParam = { id, activate: activate ? 0 : 1, schema: 'BaseUserPut' };

    active(sendParam).then(res => {
      if (res) {
        message.success('修改成功');
        this.success();
      } else {
        message.error('错误');
      }
    });
  };

  success = () => {
    const { onSuccess } = this.props;

    onSuccess();
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  isDisabled = () => {
    const { projectList } = this.state;
    // const result = projectList.reduce((total = 0, item) => {
    //   return total + item.engineers.length;
    // });
    const result = projectList.length > 0 ? projectList[0].engineers.length : false;
    return result;
  };

  render() {
    const { activate, pmName } = this.props;
    const { visible, projectList } = this.state;

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
    const footer = (
      <Button disabled={projectList.length > 0 && this.isDisabled()} onClick={this.enabled} type="primary">
        {activate ? '账号禁用' : '账号启用'}
      </Button>
    );
    return (
      <Fragment>
        <span onClick={this.showModal} style={{color:'#1890FF'}}>{activate ? '账号禁用' : '账号启用'}</span>
        <Modal
          title={activate ? '账号禁用' : '账号启用'}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={500}
          destroyOnClose
          maskClosable={false}
          footer={footer}
        >


          {
            projectList.length ? (
              <div>
                {
                  projectList.map((item) => (
                    item.engineers.length ? (
                      <div>
                        <Alert message={warringText} type="warning" showIcon />
                        <Form>
                          <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
                            <Col span={10} md={20} sm={18}>
                              <FormItem label="项目经理" {...formItemLayout}>
                                {pmName}
                              </FormItem>
                            </Col>
                          </Row>
                          <Row gutter={{ md: 20, lg: 20, xl: 40 }}>
                            <Col span={10} md={20} sm={18}>
                              <FormItem label="项目名称" {...formItemLayout}>
                                {item.name}
                              </FormItem>
                            </Col>
                            <Col span={10} md={20} sm={18}>
                              <FormItem label="项目人员" {...formItemLayout}>
                                {item.engineers[0] && item.engineers[0].real_name}
                                {item.engineers[1] && `,${item.engineers[1].real_name}`}等
                                {item.engineers.length}人
                              </FormItem>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    ) : (
                      <Alert message={successText} type="success" showIcon />
                      )
                  ))
                }
              </div>
            ) : (
              <Alert message={successText} type="success" showIcon />
              )
          }
        </Modal>
      </Fragment>
    );
  }
}

export default IsEnabled;

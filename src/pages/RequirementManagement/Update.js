import React from 'react';
import { connect } from 'dva/index';
import moment from 'moment';
import { Modal, Form, Input, Row, Col, message, Divider } from 'antd';
import get from 'lodash/get';

import styles from './style.less';
// import AddProjet from './AddProjet';
import CheckGroup from '@/components/CheckGroup';

const FormItem = Form.Item;
const { TextArea } = Input;

const ways = {
  0: '日',
  1: '月',
};

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
    companyId: menu.companyId,
    loading: loading.effects['LevelManagement/add'], // 是否加载loading
    detail: requirementManagement.detail,
  })
)
@Form.create()
class Update extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.getDetail();
  };

  getDetail = async () => {
    const { dispatch, id } = this.props;
    await dispatch({
      type: 'requirementManagement/getDetail',
      payload: { id, schema: 'OfferDetailSchema' },
    });
  };

  handleOk = () => {
    const prop = this.props;
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = { ...fieldsValue };
      this.add(sendParams);
    });
  };

  // 添加
  add = data => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'requirementManagement/update',
      payload: {
        ...data,
        id,
        schema: 'OfferModifySchema',
      },
      callback: datas => {
        if (datas) {
          this.success();
          message.success('提交成功');
        } else {
          message.error('错误');
        }
      },
    });
  };

  success = async () => {
    const prop = this.props;
    const { resetFields } = prop.form;
    const { onSuccess } = this.props;
    await this.setState({
      visible: false,
    });
    await resetFields();
    await onSuccess();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.resetList();
  };

  resetList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'requirementManagement/saveDetail',
      payload: { statistics: {} },
    });
  };

  rate = (need, all) => {
    const rate = Math.round((need / all) * 100);
    if (rate >= 100) {
      return 100;
    }
    if (need === 0 && all === 0) {
      return 0;
    }
    return Math.round((need / all) * 100);
  };

  render() {
    const prop = this.props;
    /* eslint-disable */
    const { detail } = prop;
    const {
      statistics: {
        cv_pass_amount = 0,
        cv_push_amount = 0,
        demand_amount = 0,
        entry_amount = 0,
        interview_pass_amount = 0,
      },
    } = detail;
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
    const formItemLayoutShowMore = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 14 },
      },
    };

    return (
      <>
        <span className={styles.tableListOperator}>
          <span onClick={this.showModal} style={{ color: '#1890FF' }}>
            详情
          </span>
        </span>
        <Modal
          title="详情"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
          destroyOnClose
          maskClosable={false}
        >
          <Form>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="需求名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: detail.name,
                    rules: [
                      {
                        required: true,
                        message: '需求名称不可为空',
                      },
                      {
                        max: 64,
                        message: '需求名称最大长度为64',
                      },
                    ],
                  })(<Input placeholder="请输入需求名称" type="text" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="需求人数" {...formItemLayout}>
                  {getFieldDecorator('amount', {
                    initialValue: detail.amount,
                    rules: [
                      {
                        required: true,
                        message: '需求人数不可为空',
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
                  })(<Input placeholder="请输入需求人数" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col md={20}>
                <FormItem label="需求详情" {...formItemLayout}>
                  {getFieldDecorator('description', {
                    initialValue: detail.description,
                    rules: [
                      { required: true, message: '需求详情不可为空' },
                      {
                        max: 2000,
                        message: '需求详情最大长度为2000',
                      },
                    ],
                  })(
                    <TextArea autosize={{ minRows: 5, maxRows: 20 }} placeholder="请输入需求详情" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="工作点" {...formItemLayout}>
                  {getFieldDecorator('work_place', {
                    initialValue: detail.work_place,
                    rules: [
                      {
                        required: true,
                        message: '工作地点不可为空',
                      },
                      {
                        max: 64,
                        message: '工作地点最大长度为64',
                      },
                    ],
                  })(<Input placeholder="请输入工作地点" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="创建时间" {...formItemLayout}>
                  {moment(detail.created).format('YYYY年MM月DD日 HH:mm')}
                </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={12}>
                <FormItem label="需求项目:" {...formItemLayoutShowMore}>
                  {get(detail, 'project.name')}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="项目经理:" {...formItemLayoutShowMore}>
                  {get(detail, 'pm.real_name')}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={12}>
                <FormItem label="计费模式:" {...formItemLayoutShowMore}>
                  {`按${ways[detail.salary_type]}计费`}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="项目职位:" {...formItemLayoutShowMore}>
                  {get(detail, 'position.name')}
                </FormItem>
              </Col>
            </Row>
            <div />
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="级别" {...formItemLayout}>
                  {getFieldDecorator('position_levels', {
                    initialValue: get(detail, 'position_levels', []).map(i => String(i.id)),
                    rules: [
                      {
                        required: true,
                        message: '级别不可为空',
                      },
                    ],
                  })(
                    <CheckGroup
                      level={get(detail, 'position.position_levels', [])}
                      way={ways[detail.salary_type]}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={12}>
                <FormItem label="简历需求比:" {...formItemLayoutShowMore}>
                  {`${cv_push_amount}/${demand_amount}`}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="简历通过率:" {...formItemLayoutShowMore}>
                  {this.rate(cv_pass_amount, cv_push_amount)}%
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={12}>
                <FormItem label="面试通过率:" {...formItemLayoutShowMore}>
                  {this.rate(interview_pass_amount, cv_pass_amount)}%
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="需求满足率:" {...formItemLayoutShowMore}>
                  {`${Math.round((entry_amount / demand_amount) * 100)}%`}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Update;

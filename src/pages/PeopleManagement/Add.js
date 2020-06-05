import React from 'react';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import find from 'lodash/find';
import get from 'lodash/get';
import moment from 'moment';

import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  Radio,
  message,
  Alert,
  Divider,
  DatePicker,
} from 'antd';
import styles from './style.less';
import Upload from './component/Upload';
import PMAdd from '../ProjectManagement/Add';
import ProjectAdd from '../Project/Add';
import FeeAdd from '../FeeManagement/Add';
import { getList } from '@/services/positionManagement';
import { directEnterProject } from '@/services/enterProjects';

const FormItem = Form.Item;
const { Option } = Select;
const ways = {
  0: '日',
  1: '月',
};

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
}

@connect(({ projects, menu, loading, positionManagement, levelManagement, projectManagement }) => ({
  projects: projects.list.data,
  position: positionManagement.list.data,
  level: levelManagement.list.data,
  projectManagement: projectManagement.list.data,
  companyId: menu.companyId,
  loading: loading.effects['LevelManagement/add'], // 是否加载loading
}))
@Form.create()
class Add extends React.Component {
  state = {
    visible: false,
    showTip: false,
    pms: [],
    submitting: false,
    fileList: [],
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.getProjects();
    this.getPosition(0);
    this.isShowTip();
  };

  getProjects = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'projects/getList',
      payload: { page: 1, per_page: 10000, schema: 'ProjectWithPmsSchema' },
    });
    // dispatch({
    //   type: 'levelManagement/getList',
    //   payload: { company_id: companyId },
    // });

    // dispatch({
    //   type: 'projectManagement/getList',
    //   payload: { company_id: companyId },
    // });
  };

  getPM = async id => {
    await this.getProjects();
    const {
      projects,
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ pm_id: '' });
    const project = projects.filter(i => i.id === id);
    await this.setState({
      pms: project.length ? project[0].pms : [],
    });
  };

  getPosition = async value => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ position_id: [], position_levels: [] });
    await dispatch({
      type: 'levelManagement/saveList',
      payload: { data: [], page_info: {} },
    });
    await dispatch({
      type: 'positionManagement/getList',
      payload: {
        page: 1,
        per_page: 10000,
        schema: 'PositionWithLevelsSchema',
        salary_type: value,
      },
    });
  };

  getLevel = async id => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ position_levels: [] });
    await dispatch({
      type: 'levelManagement/saveList',
      payload: { data: [], page_info: {} },
    });
    await dispatch({
      type: 'levelManagement/getList',
      payload: { page: 1, per_page: 10000, position_id: id },
    });
  };

  handleOk = () => {
    const prop = this.props;
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      /* eslint-disable */
      const {
        project_id,
        pm_id,
        position_level_id,
        salary_type,
        work_content,
        start_date,
        service_type,
        work_place,
      } = fieldsValue;
      const engineer = {
        real_name: fieldsValue.real_name,
        gender: fieldsValue.gender,
        phone: fieldsValue.phone,
        email: fieldsValue.email,
        cv_upload_result: fieldsValue.cv_upload_result,
      };
      const sendParams = {
        project_id,
        pm_id,
        position_level_id,
        salary_type,
        work_content,
        service_type,
        work_place,
        engineer,
        start_date: moment(start_date).format('YYYY-MM-DD'),
      };
      this.add(sendParams);
      /* eslint-enable */
    });
  };

  // 添加
  add = data => {
    this.setState({
      submitting: true,
    });
    directEnterProject(data).then(res => {
      this.setState({
        submitting: false,
      });
      if (res) {
        this.success(res);
        message.success('提交成功');
      } else {
        message.error('错误');
      }
    });
  };

  // 是否显示提示
  isShowTip = () => {
    getList().then(res => {
      this.setState({
        showTip: res.data.length,
      });
    });
  };

  success = async () => {
    const {
      dispatch,
      form: { resetFields },
    } = this.props;
    // const { onSuccess } = this.props;
    await this.setState(
      {
        visible: false,
      },
      () => {
        dispatch(routerRedux.push(`/entryManagement`));
      }
    );
    await resetFields();
    await this.resetList();
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
      type: 'levelManagement/saveList',
      payload: { data: [], page_info: {} },
    });
    dispatch({
      type: 'positionManagement/saveList',
      payload: { data: [], page_info: {} },
    });
    dispatch({
      type: 'projects/saveList',
      payload: { data: [], page_info: {} },
    });
    dispatch({
      type: 'projectManagement/saveList',
      payload: { data: [], page_info: {} },
    });
  };

  resize = () => {
    // this.handleOk();
    if (this.createOrder) {
      // eslint-disable-next-line no-console
      console.log((this.createOrder.state.id = 1));
      // eslint-disable-next-line no-console
      console.log(this.createOrder);

      // this.createOrder.showModal()
    }
  };

  uploadFileList = fileList => {
    this.setState({
      fileList,
    });
  };

  render() {
    const prop = this.props;
    const { level = [], projects, position } = prop;
    const { getFieldDecorator, getFieldValue } = prop.form;
    const { visible, pms, showTip, submitting, fileList } = this.state;
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

    return (
      <>
        <Button
          type="primary"
          icon="plus-circle"
          className={styles.tableListOperator}
          onClick={this.showModal}
        >
          点击增员
        </Button>
        <Modal
          title="增员"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
          maskClosable={false}
          confirmLoading={submitting}
        >
          {showTip < 1 && (
            <Alert
              message={
                <div>
                  <span>当前未创建价格单，请先创建价格单后再创建需求。</span>
                </div>
              }
              type="warning"
              showIcon
              closable
            />
          )}
          <Form>
            <h2>创建账号</h2>
            <Divider />
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('real_name', {
                    rules: [
                      {
                        required: true,
                        message: '姓名不可为空',
                      },
                      {
                        max: 10,
                        message: '姓名最大长度为10',
                      },
                    ],
                  })(<Input placeholder="请输入姓名" type="text" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('gender', {
                    rules: [
                      {
                        required: true,
                        message: '性别不可为空',
                      },
                    ],
                  })(
                    <Radio.Group>
                      <Radio value={1}>男</Radio>
                      <Radio value={0}>女</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="手机号" {...formItemLayout}>
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: '手机号码不可为空',
                      },
                      {
                        message: '请输入正确电话号码',
                        pattern: /^1[3456789]\d{9}$/,
                      },
                    ],
                  })(<Input placeholder="请输入手机号" type="text" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="邮箱" {...formItemLayout}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: '邮箱不可为空',
                      },
                      {
                        message: '请输入正确邮箱格式',
                        pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                      },
                    ],
                  })(<Input placeholder="请输入邮箱" type="text" maxLength={64} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="上传简历" {...formItemLayout}>
                  {getFieldDecorator('cv_upload_result', {
                    rules: [
                      {
                        required: true,
                        message: '简历不可为空',
                      },
                    ],
                  })(<Upload uploadFileList={this.uploadFileList} fileList={fileList} />)}
                  支持pdf、doc、docx格式文件
                </FormItem>
              </Col>
            </Row>
            <h2>创建入项信息</h2>
            <Divider />
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="入项项目" {...formItemLayout}>
                  {getFieldDecorator('project_id', {
                    rules: [
                      {
                        required: true,
                        message: '入项项目不可为空',
                      },
                    ],
                  })(
                    <Select style={{ width: '80%' }} placeholder="请选择" onChange={this.getPM}>
                      {projects.map(each => {
                        return <Option value={each.id}>{each.name}</Option>;
                      })}
                    </Select>
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <ProjectAdd onSuccess={this.getProjects} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="项目经理" {...formItemLayout}>
                  {getFieldDecorator('pm_id', {
                    rules: [
                      {
                        required: true,
                        message: '项目经理不可为空',
                      },
                    ],
                  })(
                    <Select style={{ width: '80%' }} placeholder="请选择">
                      {pms.map(each => {
                        return <Option value={each.id}>{each.real_name}</Option>;
                      })}
                    </Select>
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <PMAdd
                    onSuccess={() => this.getPM(getFieldValue('project_id'))}
                    id={getFieldValue('project_id')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="计费模式" {...formItemLayout}>
                  {getFieldDecorator('salary_type', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                        message: '计费模式不可为空',
                      },
                    ],
                  })(
                    <Radio.Group onChange={e => this.getPosition(e.target.value)}>
                      <Radio value={0}>按日计费</Radio>
                      <Radio value={1}>按月计费</Radio>
                    </Radio.Group>
                  )}
                  <FeeAdd
                    onSuccess={() => this.getPosition(getFieldValue('salary_type'))}
                    way={ways[getFieldValue('salary_type')]}
                    text={
                      <Button type="primary" icon="plus-circle">
                        创建职位价格信息
                      </Button>
                    }
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="职位" {...formItemLayout}>
                  {getFieldDecorator('position_id', {
                    rules: [
                      {
                        required: true,
                        message: '职位不可为空',
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择" onChange={this.getLevel}>
                      {position.map(each => {
                        return <Option value={each.id}>{each.name}</Option>;
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="级别" {...formItemLayout}>
                  {getFieldDecorator('position_level_id', {
                    // initialValue: level,
                    rules: [
                      {
                        required: true,
                        message: '级别不可为空',
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择级别">
                      {level.map(each => {
                        return <Option value={each.id}>{each.name}</Option>;
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="单价" {...formItemLayout}>
                  {get(find(level, { id: getFieldValue('position_level_id') }), 'money', '')}
                  元/{ways[getFieldValue('salary_type')]}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="入项时间" {...formItemLayout}>
                  {getFieldDecorator('start_date', {
                    rules: [
                      {
                        required: true,
                        message: '入项时间不可为空',
                      },
                    ],
                  })(<DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={20}>
                <FormItem label="工作地点" {...formItemLayout}>
                  {getFieldDecorator('work_place', {
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
          </Form>
        </Modal>
      </>
    );
  }
}

export default Add;

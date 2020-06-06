import React from 'react';
import { connect } from 'dva/index';
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
  // eslint-disable-next-line no-unused-vars
  Alert,
  Divider,
  Icon,
  Typography
} from 'antd';
import styles from './style.less';
// import AddProjet from './AddProjet';
import PMAdd from '../ProjectManagement/Add';
import ProjectAdd from '../Project/Add';
import FeeAdd from '../FeeManagement/Add';
import CheckGroup from '@/components/CheckGroup';
import { getList } from '@/services/positionManagement';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;


const ways = {
  0: '日',
  1: '月',
};

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
    position_types: ["技术", "产品", "设计", "运营"],
    service_types: ["远程服务", "现场服务"],
    experiences: ["1年以内", "1~3年", "3~5年", "5~10年"],
    educations: ["高中", "大专", "本科", "硕士", "博士"]
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
      const sendParams = { ...fieldsValue };
      this.add(sendParams);
    });
  };

  // 添加
  add = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'requirementManagement/add',
      payload: {
        ...data,
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

  // 是否显示提示
  isShowTip = () => {
    getList().then(res => {
      this.setState({
        showTip: res.data.length,
      });
    });
  };

  success = async () => {
    const prop = this.props;
    const { resetFields } = prop.form;
    const { onSuccess } = this.props;
    console.log('props: ', this.props)

    await this.setState({
      visible: false,
    });
    await resetFields();
    await this.resetList();
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
    const { level, projects, position } = prop;
    const { getFieldDecorator, getFieldValue } = prop.form;

    const { visible, pms, showTip } = this.state;
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
        <span className={styles.tableListOperator}>
          <Button onClick={this.showModal} type="primary">
            创建需求
          </Button>
        </span>
        <Modal
          title="创建需求"
          centered
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
          okText="提交需求"
          destroyOnClose
          maskClosable={false}
        >
          <Form>
            <Title level={4} className={styles.formSubTitle}>1 需求基本信息</Title>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="公司" {...formItemLayout} className={styles.mb0}>
                  <Text>中信建投有限公司</Text>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="职位名称" {...formItemLayout} className={styles.mb1}>
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true,
                      message: '需求名称不可为空',
                    }, {
                      max: 64,
                      message: '需求名称最大长度为64',
                    }],
                  })(<Input placeholder="请输入" type="text" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="职位类型" {...formItemLayout} className={styles.mb1}>
                  {getFieldDecorator('position_type', {
                    rules: [
                      {
                        required: true,
                        message: '需求人数不可为空',
                      }
                    ],
                  })(<Select>
                    {this.state.position_types.map((position_type, idx) => {
                      return <Option key={idx} value={position_type}>{position_type}</Option>;
                    })}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="服务方式" {...formItemLayout} className={styles.mb1}>
                  {getFieldDecorator('service_type', {
                    rules: [
                      { required: true, message: '需求详情不可为空' },

                    ],
                  })(<Select>
                    {this.state.service_types.map((service_type, idx) => {
                      return <Option key={idx} value={service_type}>{service_type}</Option>
                    })}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="工作地点" {...formItemLayout} className={styles.mb1}>
                  {getFieldDecorator('work_place', {
                    rules: [{
                      required: true,
                      message: '工作地点不可为空',
                    }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Divider dashed style={{ marginTop: 10, marginBottom: 10 }} />
            <Title level={4} className={styles.formSubTitle}>2 职位要求</Title>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="经验" {...formItemLayout} className={styles.mb1}>
                  {getFieldDecorator('experience', {
                    rules: [{
                      required: true,
                      message: '需求项目不可为空',
                    }],
                  })(
                    <Select
                    // onChange={this.getExpreience}
                    >
                      {this.state.experiences.map((experience, idx) => {
                        return <Option key={idx} value={experience}>{experience}</Option>;
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="学历" {...formItemLayout} className={styles.mb1}>
                  {getFieldDecorator('education', {
                    rules: [{
                      required: true,
                      message: '项目经理不可为空',
                    }]
                  })(
                    <Select>
                      {this.state.educations.map((education, idx) => {
                        return (
                          <Option key={idx} value={education}>
                            {education}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="单价" {...formItemLayout} className={styles.mb1}>
                  {getFieldDecorator('unit_price', {
                    initialValue: 0,
                    rules: [{
                      required: true,
                      message: '计费标准不可为空',
                    }, {
                      message: '需求人数不能为负数',
                      pattern: /^\d+(\.\d+)?$/,
                    }, {
                      pattern: /^\+?[1-9][0-9]*$/,
                      message: '需求人数必须为正整数',
                    }],
                  })(<Input
                    type="text"
                    placeholder="请输入"
                  />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="职位描述" {...formItemLayout} className={styles.mb1}>
                  {getFieldDecorator('description', {
                    rules: [{
                      required: true,
                      message: '职位不可为空',
                    }, {
                      max: 2000,
                      message: '需求详情最大长度为2000',
                    }],
                  })(
                    <TextArea rows={4} placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Divider dashed style={{ marginTop: 10, marginBottom: 10 }} />
            <Title level={4} className={styles.formSubTitle}>3 服务要求</Title>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <FormItem label="委托代找简历" {...formItemLayout} className={styles.mb0}>
                  {getFieldDecorator('need_resume', {
                    rules: [{
                      required: true,
                      message: '级别不可为空',
                    }],
                  })(<Radio.Group onChange={e => this.getPosition(e.target.value)}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>)}
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

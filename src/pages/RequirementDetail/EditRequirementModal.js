import React from 'react'
import { Modal, Button, Form, Row, Col, Input, Select, Radio, Typography, Divider, message } from 'antd'
import classes from '../RequirementManagement/style.less'

import { connect } from 'dva/index';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input

// cobra-55555 -20-04-22
@Form.create()

@connect(({ loading }) => ({
  loading: loading.effects['requirementManagement/update'], // 是否加载loading
}))

export default class EditRequirementModal extends React.PureComponent {
  state = {
    visible: false,
    position_types: ["技术", "产品", "设计", "运营"],
    service_types: ["远程服务", "现场服务"],
    experiences: ["1年以内", "1~3年", "3~5年", "5~10年"],
    educations: ["高中", "大专", "本科", "硕士", "博士"],
  }

  componentWillMount = () => {
  }

  // cobra-55555 -20-04-22
  update = data => {
    const { dispatch } = this.props;

    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split("/");
    const id = array[array.length - 1];

    dispatch({
      type: 'requirementManagement/update',
      payload: {
        id,
        schema: 'OfferPostSchema',
        ...data,
      },
      callback: datas => {
        if (datas.success == 1) {
          this.editSuccess();
          message.success('提交成功');
          this.handleCancel();
        } else {
          message.error('错误');
        }
      },
    })
  }

  editSuccess = async () => {
    const { dispatch } = this.props;
    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split("/");
    const id = array[array.length - 1];
    await dispatch({
      type: 'requirementManagement/getDetail',
      payload: {
        id,
        schema: 'OfferDetailSchema',
      },
    });
  }

  handleOk = () => {
    const prop = this.props;
    const { validateFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const sendParams = { ...fieldsValue };
      this.update(sendParams);
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.resetList();
  };
  // // // // //

  // cobra-55555 -20-04-22
  render() {
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
      }
    };
    const {
      visible,
      position_types,
      service_types,
      experiences,
      educations,
      // detail
    } = this.state;

    const detail = this.props.data;

    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        <Button onClick={() => this.setState({ visible: true })} style={{ marginRight: 15 }} size="small">编辑需求</Button>
        <Modal
          title="需求编辑"
          centered
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: false })}
          width={600}
          okText="保存"
          destroyOnClose
          maskCloseable={false}
        >
          <Form>
            <Title level={4} className={classes.formSubTitle}>1 需求基本信息</Title>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item
                  label="公司"
                  {...formItemLayout}
                  className={classes.mb0}>
                  <Text>中信建投有限公司</Text>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="职位名称" {...formItemLayout} className={classes.mb1}>
                  {getFieldDecorator('name', {
                    initialValue: detail.position,
                    rules: [{
                      required: true,
                      message: '需求名称不可为空',
                    }, {
                      max: 64,
                      message: '需求名称最大长度为64',
                    }],
                  })(<Input placeholder="请输入" type="text" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="职位类型" {...formItemLayout}>
                  {getFieldDecorator('position_type', {
                    initialValue: detail.position_type,
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
                </Form.Item>

              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="服务方式" {...formItemLayout}>
                  {getFieldDecorator('service_type', {
                    initialValue: detail.service_method,
                    rules: [
                      {
                        required: true,
                        message: '需求人数不可为空',
                      }
                    ],
                  })(<Select>
                    {this.state.service_types.map((service_type, idx) => {
                      return <Option key={idx} value={service_type}>{service_type}</Option>;
                    })}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>


            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="工作地点" {...formItemLayout} className={classes.mb1}>
                  {getFieldDecorator('work_place', {
                    initialValue: detail.work_space,
                    rules: [{
                      required: true,
                      message: '工作地点不可为空',
                    }],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>


            <Divider dashed style={{ marginTop: 10, marginBottom: 10 }} />
            <Title level={4} className={classes.formSubTitle}>2 职位要求</Title>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="经验" {...formItemLayout} className={classes.mb1}>
                  {getFieldDecorator('experience', {
                    initialValue: detail.experience,
                    rules: [
                      {
                        required: true,
                        message: '需求项目不可为空',
                      }
                    ],
                  })(<Select>
                    {this.state.experiences.map((experience, idx) => {
                      return <Option key={idx} value={experience}>{experience}</Option>;
                    })}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="学历" {...formItemLayout} className={classes.mb1}>
                  {getFieldDecorator('education', {
                    initialValue: detail.education,
                    rules: [
                      {
                        required: true,
                        message: '需求项目不可为空',
                      }
                    ],
                  })(<Select>
                    {this.state.educations.map((education, idx) => {
                      return <Option key={idx} value={education}>{education}</Option>;
                    })}
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="单价" {...formItemLayout} className={classes.mb1}>
                  {getFieldDecorator('unit_price', {
                    initialValue: detail.unit_price,
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
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="职位描述" {...formItemLayout} className={classes.mb1}>
                  {getFieldDecorator('description', {
                    initialValue: detail.description,
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
                </Form.Item>
              </Col>
            </Row>
            <Divider dashed style={{ marginTop: 10, marginBottom: 10 }} />
            <Title level={4} className={classes.formSubTitle}>3 服务要求</Title>
            <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
              <Col span={21}>
                <Form.Item label="委托代找简历" {...formItemLayout} className={classes.mb0}>
                  {getFieldDecorator('need_resume', {
                    initialValue: detail.need_resume,
                    rules: [{
                      required: true,
                      message: '级别不可为空',
                    }],
                  })(<Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </React.Fragment>
    )
  }
}
import React from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, Checkbox, Icon, Tag } from 'antd';
import { connect } from 'dva/index';
import pickBy from 'lodash/pickBy';
import mapKeys from 'lodash/mapKeys';

const { Option } = Select;

const AUTO_RENEW = {
  0: '自动续签',
  1: '手动续签',
};

const SALARY_TYPE = {
  0: '按日计费',
  1: '按月计费',
};

const ENTRY_TYPE = {
  0: '自主招聘',
  1: '平台招聘',
};

const S_NEED_RENEW_ORDER = {
  true: 1,
  false: 0,
};

const STATUS = {
  on_duty: '正常',
  leaving: '待出项',
  finish: '已出项',
};

@Form.create()
@connect(({ projectManagement, projects, positionManagement, levelManagement }) => ({
  levelList: levelManagement.list.data,
  positionList: positionManagement.list.data,
  pmList: projectManagement.list.data,
  projectsList: projects.list.data,
}))
class DrawerForm extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  resetFileds = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
  };

  shiftValueForShow = fieldsValue => {
    const { projectsList, pmList, positionList, levelList } = this.props;
    const result = pickBy(fieldsValue, o => o !== undefined);
    /*eslint-disable*/
    mapKeys(result, (value, key) => {
      if (key === 's_need_renew_order') {
        result.s_need_renew_order = result.s_need_renew_order ? '是' : '否';
      }
      if (key === 'status') {
        result.status = STATUS[result.status];
      }
      if (key === 'project_id') {
        result.project_id = projectsList.filter(i => i.id == result.project_id)[0].name;
      }
      if (key === 'pm_id') {
        result.pm_id = pmList.filter(i => i.id == result.pm_id)[0].real_name;
      }
      if (key === 'auto_renew') {
        result.auto_renew = AUTO_RENEW[result.auto_renew];
      }
      if (key === 'position_id') {
        result.position_id = positionList.filter(i => i.id == result.position_id)[0].name;
      }
      if (key === 'position_level_id') {
        result.position_level_id = levelList.filter(i => i.id == result.position_level_id)[0].name;
      }
      if (key === 'salary_type') {
        result.salary_type = SALARY_TYPE[result.salary_type];
      }
      if (key === 'use_hr_service') {
        result.use_hr_service = ENTRY_TYPE[result.use_hr_service];
      }
    });
    return result;
    /* eslint-enable */
  };

  handleOk = () => {
    /* eslint-disable */
    const {
      form: { validateFields },
      searchChange,
      onSearch,
    } = this.props;
    validateFields((err, fieldsValue) => {
      if (fieldsValue.s_need_renew_order !== undefined) {
        fieldsValue.s_need_renew_order = S_NEED_RENEW_ORDER[fieldsValue.s_need_renew_order];
      }
      if (err) return;
      const searchParams = this.shiftValueForShow(fieldsValue);

      searchChange(searchParams);
      const haveQuery = Object.keys(searchParams).length > 0; // 判断是否有参数传入

      if (haveQuery) {
        onSearch(fieldsValue);
      } else {
        onSearch();
      }
      this.onClose();
      /* eslint-enable */
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      projectsList = [],
      pmList = [],
      positionList = [],
      levelList = [],
    } = this.props;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 19 },
      },
    };
    return (
      <a>
        <Icon type="filter" onClick={this.showDrawer} style={{ fontSize: '20px' }} />
        <Drawer title="人员筛选" width={500} onClose={this.onClose} visible={visible}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator('s_need_renew_order', { valuePropName: 'checked' })(
                    <Checkbox>采购订单待等待续签</Checkbox>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="姓名" {...formItemLayout}>
                  {getFieldDecorator('like_real_name', {})(
                    <Input placeholder="请输入姓名" maxLength={10} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="手机号" {...formItemLayout}>
                  {getFieldDecorator('like_phone', {
                    rules: [
                      {
                        message: '请输入正确电话号码',
                        // pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
                        pattern: /^1[3456789]\d{9}$/,
                      },
                    ],
                  })(<Input placeholder="请输入手机号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="人员状态" {...formItemLayout}>
                  {getFieldDecorator('status', {})(
                    <Select placeholder="请选择人员状态" allowClear>
                      {Object.keys(STATUS).map(item => (
                        <Option key={item} value={item}>
                          {STATUS[item]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="所属项目" {...formItemLayout}>
                  {getFieldDecorator('project_id', {})(
                    <Select placeholder="请选择所属项目" allowClear>
                      {projectsList.map(project => (
                        <Option key={project.id}>{project.name}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="项目经理" {...formItemLayout}>
                  {getFieldDecorator('pm_id', {})(
                    <Select placeholder="请选择项目经理" allowClear>
                      {pmList.map(pm => (
                        <Option key={pm.id} value={pm.id}>
                          {pm.real_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="采购订单签约形式" {...formItemLayout}>
                  {getFieldDecorator('auto_renew', {})(
                    <Select placeholder="请选择采购订单签约形式" allowClear>
                      {Object.keys(AUTO_RENEW).map(item => (
                        <Option key={item}>{AUTO_RENEW[item]}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="职位" {...formItemLayout}>
                  {getFieldDecorator('position_id', {})(
                    <Select placeholder="请选择职位" allowClear>
                      {positionList.map(position => (
                        <Option key={position.id}>{position.name}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="级别" {...formItemLayout}>
                  {getFieldDecorator('position_level_id', {})(
                    <Select placeholder="请选择级别" allowClear>
                      {levelList.map(level => (
                        <Option key={level.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                              {level.name}({level.position.name})
                            </span>
                            <Tag color="#2db7f5">{SALARY_TYPE[level.position.salary_type]}</Tag>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="计费方式" {...formItemLayout}>
                  {getFieldDecorator('salary_type', {})(
                    <Select placeholder="请选择计费方式" allowClear>
                      {Object.keys(SALARY_TYPE).map(item => (
                        <Option key={item} value={item}>
                          {SALARY_TYPE[item]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={4}>价格</Col>
              <Col span={9}>
                <Form.Item
                  {...formItemLayout}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {getFieldDecorator('gte_s_money', {
                    rules: [
                      {
                        message: '价格不能为负数,且只能保留2位小数',
                        pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                      },
                    ],
                  })(<Input placeholder="请输入价格" />)}
                </Form.Item>
              </Col>
              <Col span={1}>至</Col>
              <Col span={9} style={{ display: 'flex', justifyContent: 'center' }}>
                <Form.Item
                  {...formItemLayout}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {getFieldDecorator('lte_s_money', {
                    rules: [
                      {
                        message: '价格不能为负数,且只能保留2位小数',
                        pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                      },
                    ],
                  })(<Input placeholder="请输入价格" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={4}>综合态度分</Col>
              <Col span={9}>
                <Form.Item
                  {...formItemLayout}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {getFieldDecorator('gte_attitude_score', {
                    rules: [
                      {
                        message: '价格不能为负数,且只能保留2位小数',
                        pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                      },
                    ],
                  })(<Input placeholder="请输入价格" />)}
                </Form.Item>
              </Col>
              <Col span={1}>至</Col>
              <Col span={9} style={{ display: 'flex', justifyContent: 'center' }}>
                <Form.Item
                  {...formItemLayout}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {getFieldDecorator('lte_attitude_score', {
                    rules: [
                      {
                        message: '价格不能为负数,且只能保留2位小数',
                        pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                      },
                    ],
                  })(<Input placeholder="请输入价格" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={4}>综合能力分</Col>
              <Col span={9}>
                <Form.Item
                  {...formItemLayout}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {getFieldDecorator('gte_s_ability', {
                    rules: [
                      {
                        message: '价格不能为负数,且只能保留2位小数',
                        pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                      },
                    ],
                  })(<Input placeholder="请输入价格" />)}
                </Form.Item>
              </Col>
              <Col span={1}>至</Col>
              <Col span={9} style={{ display: 'flex', justifyContent: 'center' }}>
                <Form.Item
                  {...formItemLayout}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {getFieldDecorator('lte_s_ability', {
                    rules: [
                      {
                        message: '价格不能为负数,且只能保留2位小数',
                        pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                      },
                    ],
                  })(<Input placeholder="请输入价格" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label="招聘形式" {...formItemLayout}>
                  {getFieldDecorator('use_hr_service', {})(
                    <Select placeholder="请选择招聘形式" allowClear>
                      {Object.keys(ENTRY_TYPE).map(item => (
                        <Option key={item}>{ENTRY_TYPE[item]}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.resetFileds} style={{ marginRight: 8 }}>
              重置
            </Button>
            <Button onClick={this.handleOk} type="primary">
              查找
            </Button>
          </div>
        </Drawer>
      </a>
    );
  }
}
export default DrawerForm;

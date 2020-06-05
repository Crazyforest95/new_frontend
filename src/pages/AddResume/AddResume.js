import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Select, Popover, Upload, message } from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './TableForm';
import SkillTableForm from './SkillTableForm';
import API from '@/api';
import APP_CONFIG from '@/config';
import { getToken } from '../../utils/authority';

import styles from './style.less';

const { Option } = Select;

const fieldLabels = {
  name: '姓名',
  url: '性别',
  owner: '求职状态',
  approver: '工作状态',
  dateRange: '电话',
  type: '邮箱',
};
const jobWantedStatus = {
  positive: '积极找工作',
  negative: '暂时不换工作',
  neutral: '随便看看',
};

const gender = {
  0: '女',
  1: '男',
};

@connect(({ loading }) => ({
  submitting: loading.effects['engineer/add'],
}))
@Form.create()
class AddResume extends PureComponent {
  state = {
    width: '100%',
    fileList: [],
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
    const { dispatch } = this.props;

    dispatch({
      type: 'menu/hideResumeMenu',
    });
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll, resetFields },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, fieldsValue) => {
      if (!error) {
        // submit the values
        const params = {
          ...fieldsValue,
          cv_upload_result: fieldsValue.cv_upload_result.fileList[0].response,
        };
        dispatch({
          type: 'engineer/add',
          payload: params,
          callback: datas => {
            if (datas) {
              this.setState({
                fileList: [],
              });
              resetFields();
              message.success('提交成功');
            } else {
              message.error('错误');
            }
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width, fileList } = this.state;
    const token = getToken();

    const props = {
      action: `${APP_CONFIG.APP_HOST}${API.upload.contract}`,
      accept: '.pdf,.doc,.docx',
      headers: {
        Authorization: `Bearer ${token || ''}`,
        // Accept: 'application/json',
      },
      name: 'contract',
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
      },
      fileList,
    };

    return (
      <PageHeaderWrapper title="新建简历" hiddenBreadcrumb>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label="姓名">
                  {getFieldDecorator('real_name', {
                    rules: [{ required: true, message: '请输入' }],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label="性别">
                  {getFieldDecorator('gender', {
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择">
                      {Object.keys(gender).map(key => (
                        <Option value={key}>{gender[key]}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label="求职状态">
                  {getFieldDecorator('job_wanted_status', {
                    rules: [{ required: true, message: '请选择求职状态' }],
                  })(
                    <Select placeholder="请选择求职状态">
                      {Object.keys(jobWantedStatus).map(key => (
                        <Option value={key}>{jobWantedStatus[key]}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label="电话">
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: '请输入电话号码',
                      },
                      {
                        message: '请输入正确电话号码',
                        pattern: /^1[3456789]\d{9}$/,
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label="邮箱">
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: '请输入',
                        pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="工作技能" bordered={false} className={styles.card}>
          {getFieldDecorator('abilities', {
            initialValue: [],
          })(<SkillTableForm />)}
        </Card>
        <Card title="教育背景" bordered={false} className={styles.card}>
          {getFieldDecorator('education', {
            initialValue: [],
          })(<TableForm />)}
        </Card>
        <Card title="个人简历" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="简历">
                  {getFieldDecorator('cv_upload_result', {
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Upload {...props} disabled={fileList.length >= 1}>
                      <Button>
                        <Icon type="upload" /> Click to Upload
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default AddResume;

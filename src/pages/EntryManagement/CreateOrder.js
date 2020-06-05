import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';
import { detail, engineerCompanyOrders } from '@/services/enterProjects';

import StepForm from './StepForm';

class Detail extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    title: PropTypes.string, // modle 展示名称
    text: PropTypes.string, // 按钮名称
    onSuccess: PropTypes.func, // 成功方法
    isRenew: PropTypes.bool, // 须签订单
    engineerId: PropTypes.number, // 调用续签时需要
  };

  static defaultProps = {
    id: null,
    title: '',
    text: '',
    onSuccess: () => {},
    isRenew: true,
    engineerId: null,
  };

  state = {
    visible: false,
    refId: '',
  };

  showModal = () => {
    const { isRenew } = this.props;

    this.setState({
      visible: true,
    });
    if (isRenew) {
      return this.getDetailByEntry();
    }
    return this.getDetailByEngineer();
  };

  // 用于外部ref设置id属性
  setRefId = refId => {
    this.setState({ refId });
  };

  // 调用入项信息

  getDetailByEntry = () => {
    const { id } = this.props;
    const { refId } = this.state;
    const params = { id: id || refId };
    detail(params).then(res => {
      if (res) {
        this.saveDefaultValue(res);
      }
    });
  };

  // 调用人员信息
  getDetailByEngineer = () => {
    const { engineerId } = this.props;
    const params = { engineer_id: engineerId, sort_id: -1 };
    engineerCompanyOrders(params).then(res => {
      if (res) {
        const entryDetail = {
          ...res.data[0],
          project: res.data[0].project.name,
          position_level: res.data[0].career.position_level,
          salary_type: res.data[0].career.salary_type,
          work_place: res.data[0].career.work_place,
        };
        this.saveDefaultValue(entryDetail);
      }
    });
  };

  saveDefaultValue = details => {
    const { dispatch } = window.g_app._store; // eslint-disable-line
    dispatch({
      type: 'form/saveStepFormData',
      payload: details,
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
      type: 'projects/add',
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

  finished = () => {
    const { onSuccess } = this.props;
    this.setState({
      visible: false,
    });
    onSuccess();
  };

  render() {
    const { visible } = this.state;
    const { title, text, isRenew } = this.props;
    return (
      <Fragment>
        <span>
          <a type="plus-circle" onClick={this.showModal}>
            {text}
          </a>
        </span>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          destroyOnClose
          maskClosable={false}
          footer={null}
        >
          <StepForm finish={this.finished} title="创建采购订单" text="确定" isRenew={isRenew} />
        </Modal>
      </Fragment>
    );
  }
}

export default Detail;

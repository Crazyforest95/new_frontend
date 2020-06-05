import React, { Fragment } from 'react';
import { Modal, Form, message, Icon, Button } from 'antd';
import { connect } from 'dva/index';
import { guid } from '@/utils/utils';

import APP_CONFIG from '@/config';
import styles from './style.less'

@connect(({ projectManagement, loading }) => ({
  list: projectManagement.list,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
@Form.create()
class Resume extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
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

  render() {
    const { visible } = this.state;
    const { detail } = this.props;
    
    // cobra-55555 -20-04-25
    const { isRequirement } = this.props;
    // // // // //

    return (
      <Fragment>
        { isRequirement !== true ? 
          <a onClick={this.showModal} style={{color:'#1890FF'}}>
            简历
          </a> 
          :
          <Button type="primary" block onClick={this.showModal}>查看简历</Button>
        }
        
        <Modal
          title="个人简历"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
          destroyOnClose
          maskClosable={false}
          footer={null}
        >
          {detail.map(item => {
            const date = guid();
            return (
              <div key={item} className={styles.resume_box}>
                <img
                  src={`${APP_CONFIG.APP_HOST.replace([/api/], '')}${item}?${date}`}
                  alt=""
                  style={{ width: '90%' }}
                />
                <a 
                  className={styles.download} 
                  href={`${APP_CONFIG.APP_HOST.replace([/api/], '')}${item}?${date}`} 
                  download
                >
                  <Icon type="download" />
                </a>
              </div>
            );
          })}
        </Modal>
      </Fragment>
    );
  }
}

export default Resume;

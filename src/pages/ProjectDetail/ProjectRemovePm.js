import React, { Fragment } from 'react';
import { Modal, Form, message, Button } from 'antd';
import { connect } from 'dva/index';
import { removePm } from '@/services/projects';

@connect(({ projects, menu, loading }) => ({
  detail: projects.detail,
  companyId: menu.companyId,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
@Form.create()
class ProjectChangePm extends React.Component {
  // 删除
  projectRemovePmFuc = () => {
    const {
      pms: { id },
      projectId,
    } = this.props;
    const sendParams = {
      id: projectId,
      schema: 'ProjectRemovePmSchema',
      pm_id: id,
    };

    removePm(sendParams).then(res => {
      if (res) {
        message.success('删除成功');
      } else {
        message.error('错误');
      }
      this.success();
    });
  };

  projectRemovePm = () => {
    Modal.confirm({
      // title: 'This is an error message',
      content: '确定删除吗？',
      onOk: () => this.projectRemovePmFuc(),
      okText: '确定',
      cancelText: '取消',
    });
  };

  success = () => {
    const { onSuccess } = this.props;
    onSuccess();
  };

  render() {
    return (
      <Fragment>
        <span>
          <Button type="primary" onClick={this.projectRemovePm}>
            项目经理移除项目
          </Button>
        </span>
      </Fragment>
    );
  }
}

export default ProjectChangePm;

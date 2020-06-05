import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './style.less';
import Add from './Add';
import ProjectDetailCard from './ProjectDetailCard';

@connect(({ projects, loading }) => ({
  detail: projects.detail,
  loading: loading.effects['projects/getDetail'], // 是否加载loading
}))
@Form.create()
class ProjectDetail extends PureComponent {
  state = {};

  componentDidMount() {
    this.getList();
  }

  // 获取列表
  getList = () => {
    const { dispatch, match } = this.props;
    const {
      params: { id },
    } = match;
    dispatch({
      type: 'projects/getDetail',
      payload: {
        id,
        schema: 'ProjectWithPmsEngineers',
      },
    });
  };

  goBack = () => {
    window.history.back();
  };

  render() {
    const {
      detail: { pms_engineers = [] }, // eslint-disable-line
      match,
      loading,
    } = this.props; // eslint-disable-line
    const {
      params: { id },
    } = match;

    const title = (
      <div>
        <Button icon="left" onClick={this.goBack}>
          返回
        </Button>
        <div style={{ marginTop: '12px' }}>项目详情</div>
      </div>
    );

    /*eslint-disable*/
    const action = (
      <Fragment>
        <Add id={id} onSuccess={this.getList} choosedPm={pms_engineers} /> 添加项目经理
      </Fragment>
    );

    return (
      <PageHeaderWrapper hiddenBreadcrumb title={title} action={action} loading={loading}>
        {pms_engineers.map(item => (
          <ProjectDetailCard key={item.id} pms={item} id={id} onSuccess={this.getList} />
        ))}
        {pms_engineers.length <= 0 && <p style={{ textAlign: 'center' }}>暂无数据</p>}
      </PageHeaderWrapper>
    );
  }
}

export default ProjectDetail;

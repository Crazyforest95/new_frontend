import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Card, Table } from 'antd';
// import styles from './style.less';
import ProjectChangePm from './ProjectChangePm';
import ProjectRemovePm from './ProjectRemovePm';
import Update from './Update';

const salaryType = {
  0: '按日结算',
  1: '按月结算',
};

const entryType = {
  0: '自主招聘',
  1: '平台招聘',
};

@connect(({ loading }) => ({
  loading: loading.effects['purchase/getList'], // 是否加载loading
}))
@Form.create()
class ProjectDetailCard extends PureComponent {
  state = {};

  render() {
    const { loading, pms = {}, onSuccess, id } = this.props;
    /* eslint-disable */
    const {
      engineers_in_project = [],
      real_name,
      engineers_in_project_count = 0,
      offers_in_project_count = 0,
      audit_in_project_count = 0,
      interview_in_project_count = 0,
      enter_in_project_count = 0
    } = pms; // eslint-disable-line
    const pagination = { pageSize: 5, total: engineers_in_project_count };

    const columns = [
      {
        title: '姓名',
        dataIndex: 'real_name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '邮箱地址',
        dataIndex: 'email',
      },
      {
        title: '入项时间',
        dataIndex: 'now_career.start',
        render: start => moment(new Date(start)).format('YYYY年MM月DD日'),
      },
      {
        title: '招聘形式',
        dataIndex: 'now_career.use_hr_service',
        render: interviewId => entryType[interviewId],
      },
      {
        title: '计费模式',
        dataIndex: 'now_career.salary_type',
        render: type => salaryType[type],
      },
      {
        title: '职位',

        dataIndex: 'now_career.position_level.position',
      },

      {
        title: '级别',
        dataIndex: 'now_career.position_level.name',
      },
      {
        title: '价格',
        dataIndex: 'now_career.position_level.money',
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: engineerId => {
          return <Update onSuccess={onSuccess} pms={pms} engineerId={engineerId} />;
        },
      },
    ];

    const extra = (
      <div>
        {(engineers_in_project_count > 0 || offers_in_project_count > 0 || audit_in_project_count > 0 || interview_in_project_count > 0 || enter_in_project_count > 0)  && (
          <ProjectChangePm onSuccess={onSuccess} pms={pms} projectId={id} />
        )}
        {offers_in_project_count === 0 && engineers_in_project_count === 0 && audit_in_project_count === 0 && interview_in_project_count === 0 && enter_in_project_count === 0 && (
          <ProjectRemovePm onSuccess={onSuccess} pms={pms} projectId={id} />
        )}
      </div>
    );
    /* eslint-enable */

    return (
      <>
        <Card
          bordered={false}
          title={<>项目经理 {real_name}</>} // eslint-disable-line
          extra={extra}
        >
          <div>
            <Table
              loading={loading}
              // rowSelection={rowSelection}
              columns={columns}
              rowKey={record => record.id}
              dataSource={engineers_in_project} // eslint-disable-line
              // dataSource={dataSource}
              onChange={this.handleChange} // 点击分页回掉事件
              pagination={{ ...pagination }} // 分页配置
            />
          </div>
        </Card>
      </>
    );
  }
}

export default ProjectDetailCard;

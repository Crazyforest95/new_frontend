import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, Divider } from 'antd';
import ResumeTime from './ResumeTime';
import ChangeResult from './ChangeResult';

const interviewStatus = {
  cv_new: '待查看',
  cv_read: '已查看',
  cv_pass: '约面试',
  cv_reject: '淘汰',
  interview_new: '待面',
  reject_by_engineer: '工程师拒绝',
  interview_pass: '已通过',
  interview_reject: '未通过',
  interview_undetermined: '待定',
  interview_absent: '未面试',
  entry_new: '提交入职',
  entry_pass: '入职审批通过',
  entry_reject: '入职被拒',
};
const columns = [
  {
    title: '公司名称',
    dataIndex: 'company',
    key: 'company',
  },
  {
    title: '需求名称',
    dataIndex: 'offer',
    key: 'offer',
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position_id',
  },
  {
    title: '级别',
    dataIndex: 'position_level',
    key: 'position_level',
  },
  {
    title: '最新结果',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <Fragment>
        <a>{interviewStatus[status]}</a>
        {false && (
          <Fragment>
            <Divider type="vertical" />
            <ChangeResult />
          </Fragment>
        )}
      </Fragment>
    ),
  },
  {
    title: '备注',
    dataIndex: 'educationBackground',
    key: 'educationBackground',
    render: () => false && <ResumeTime />,
  },
];

@connect(({ interview, loading }) => ({
  list: interview.list,
  loading: loading.effects['interview/getList'], // 是否加载loading
}))
@Form.create()
class WorkReport extends PureComponent {
  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 3,
  };

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'interview/saveList',
      payload: {
        data: [],
        page_info: {},
      },
    });
  }

  // 查询
  getSearch = date => {
    this.setState(
      {
        year_month: date,
        page: 1,
        per_page: 3,
      },
      () => this.getList()
    );
  };

  // 获取列表
  getList = () => {
    const urlParams = new URL(window.location.href);
    const id = urlParams.searchParams.get('id');
    const { dispatch } = this.props;

    dispatch({
      type: 'interview/getList',
      payload: {
        engineer_id: id,
        ...this.state,
        sort_id: -1,
      },
    });
  };

  // 分页
  handleChange = pagination => {
    this.setState(
      {
        page: pagination.current,
      },
      () => {
        this.getList();
      }
    );
  };

  render() {
    const { list, loading } = this.props;
    // const { selectedRowKeys } = this.state;
    const pagination = { pageSize: 3, total: list.page_info.total };

    return (
      <Card title="简历投递近况" bordered={false}>
        <Table
          style={{ marginBottom: 16 }}
          // pagination={false}
          loading={loading}
          onChange={this.handleChange} // 点击分页回掉事件
          rowKey={record => record.id}
          dataSource={list.data}
          columns={columns}
          pagination={{ ...pagination }} // 分页配置
        />
      </Card>
    );
  }
}

export default WorkReport;

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, DatePicker } from 'antd';
import Daily from './Daily';

const columns = [
  {
    title: '日期',
    dataIndex: 'year_month',
    key: 'year_month',
  },
  {
    title: '出勤天数',
    dataIndex: 'work_days',
    key: 'work_days',
  },
  {
    title: '加班天数',
    dataIndex: 'extra_work_days',
    key: 'extra_work_days',
  },
  {
    title: '倒休天数',
    dataIndex: 'rest_days',
    key: 'rest_days',
  },
  {
    title: '请假天数',
    dataIndex: 'leave_days',
    key: 'leave_days',
  },
  {
    title: '旷工天数',
    dataIndex: 'absent_days',
    key: 'absent_days',
  },
  {
    title: '态度分',
    dataIndex: 'attitude_score',
    key: 'attitude_score',
  },
  {
    title: '能力分',
    dataIndex: 'ability_score',
    key: 'ability_score',
  },
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: '操作',
    render: all => (
      <Fragment>
        <Daily detail={all} />
      </Fragment>
    ),
  },
];
const { MonthPicker } = DatePicker;

@connect(({ workReports, loading }) => ({
  list: workReports.list,
  loading: loading.effects['workReports/getList'], // 是否加载loading
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
      type: 'workReports/saveList',
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
      type: 'workReports/getList',
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
      <Card
        title="工时信息"
        bordered={false}
        extra={
          <MonthPicker
            placeholder="选择月份"
            format="YYYYMM"
            onChange={(moment, date) => this.getSearch(date)}
          />
        }
      >
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

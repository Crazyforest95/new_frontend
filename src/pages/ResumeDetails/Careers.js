import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Table } from 'antd';

const columns = [
  {
    title: '工作时间',
    render: all => {
      return `${all.start}~${all.end ? all.end : '至今'}`;
    },
  },
  {
    title: '公司名称',
    dataIndex: 'offer.company',
    key: 'offer.company',
  },
  {
    title: '所在项目',
    dataIndex: 'offer.project',
    key: 'offer.project',
  },
  {
    title: '项目经理',
    dataIndex: 'offer.pm.real_name',
    key: 'offer.pm.real_name',
  },
  {
    title: '职位',
    dataIndex: 'offer.position',
    key: 'offer.position',
  },
];

@connect(({ careers, loading }) => ({
  list: careers.list,
  loading: loading.effects['careers/getList'], // 是否加载loading
}))
@Form.create()
class Careers extends PureComponent {
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
      type: 'careers/saveList',
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
      type: 'careers/getList',
      payload: {
        engineer_id: id,
        ...this.state,
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
      <Card title="工作经历" bordered={false}>
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

export default Careers;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, DatePicker } from 'antd';

const columns = [
  {
    title: '时间',
    dataIndex: 'year_month',
    key: 'year_month',
  },
  {
    title: '单价',
    dataIndex: 'career.offer_sheet.money',
    key: 'career.offer_sheet.money',
  },
  {
    title: '服务费',
    dataIndex: 'company_pay',
    key: 'company_pay',
  },
  {
    title: '个人所得税',
    dataIndex: 'engineer_tax',
    key: 'engineer_tax',
  },
  {
    title: '社保',
    dataIndex: 'welfare',
    key: 'welfare',
  },
  {
    title: '技术服务费',
    dataIndex: 'engineer_get',
    key: 'engineer_get',
  },
];
const { MonthPicker } = DatePicker;

@connect(({ payment, loading }) => ({
  list: payment.list,
  loading: loading.effects['workReports/getList'], // 是否加载loading
}))
@Form.create()
class Payment extends PureComponent {
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
      type: 'payment/saveList',
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
      type: 'payment/getList',
      payload: {
        engineer_id: id,
        ...this.state,
        sort_id: -1,
        schema: 'PaymentTableSchema',
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
        title="薪资信息"
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

export default Payment;

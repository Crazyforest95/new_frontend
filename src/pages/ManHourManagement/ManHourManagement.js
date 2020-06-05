import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, Button, DatePicker, message } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import Add from './Add';
// import ChangePassword from './ChangePassword';
import styles from './style.less';

const { MonthPicker } = DatePicker;

@connect(({ payment, menu, loading }) => ({
  list: payment.list,
  companyId: menu.companyId,
  monthPay: payment.monthPay,
  loading: loading.effects['workReports/getList'], // 是否加载loading
}))
@Form.create()
class ManHourManagement extends PureComponent {
  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 10,
    canSendBill: false,
    year_month: moment(new Date(), 'YYYYMM').format('YYYYMM'),
  };

  componentDidMount() {
    this.getList();
    this.monthlyBill();
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
    dispatch({
      type: 'payment/saveMonthPay',
      payload: '',
    });
  }

  // 查询
  getSearch = data => {
    this.setState(
      {
        year_month: data,
        page: 1,
        per_page: 10,
      },
      () => {
        this.getList();
        this.monthlyBill();
      }
    );
  };

  // 获取列表
  getList = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'payment/getList',
      payload: {
        company_id: companyId,
        ...this.state,
        schema: 'PaymentTableSchema',
      },
    });
    dispatch({
      type: 'payment/getMonthPay',
      payload: {
        company_id: companyId,
        ...this.state,
      },
    });
  };

  // 发出结算
  sendBill = () => {
    const { dispatch, companyId } = this.props;
    /* eslint-disable */
    const { year_month } = this.state;
    /* eslint-disable */

    dispatch({
      type: 'workReports/sendBill',
      payload: {
        company_id: companyId,
        year_month,
        schema: 'MonthlyBillPostSchema',
      },
      callback: () => this.monthlyBill(),
    });
  };

  // 导出结算单
  payments = () => {
    const { dispatch, companyId } = this.props;
    /* eslint-disable */
    const { year_month } = this.state;
    /* eslint-disable */

    dispatch({
      type: 'payment/payments',
      payload: {
        company_id: companyId,
        year_month,
        schema: 'PaymentsForPurchaseExcelSchema',
      },
      callback: data => {
        if (data) {
          window.open(data);
        } else {
          message.error('错误');
        }
      },
    });
  };

  // 是否可以发出结算
  monthlyBill = () => {
    const { dispatch, companyId } = this.props;
    /* eslint-disable */
    const { year_month } = this.state;
    /* eslint-disable */

    dispatch({
      type: 'payment/monthlyBill',
      payload: {
        company_id: companyId,
        year_month,
      },
      callback: data => {
        if (data.year_month) {
          this.setState({
            canSendBill: false,
          });
        } else {
          this.setState({
            canSendBill: true,
          });
        }
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

  toDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/resumeDetails?id=${id}`));
  };

  render() {
    const { list, loading, monthPay } = this.props;
    const { canSendBill, year_month } = this.state;
    const pagination = { pageSize: 10, total: list.page_info.total };
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // }
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        render: (data, all, index) => {
          return index + 1;
        },
      },
      {
        title: '姓名',
        dataIndex: 'engineer.real_name',
      },
      {
        title: '职位',
        dataIndex: 'career.offer_sheet.position',
      },
      {
        title: '级别',
        dataIndex: 'career.offer_sheet.position_level',
      },
      {
        title: '单价',
        dataIndex: 'career.offer_sheet.money',
      },
      {
        title: '项目经理',
        dataIndex: 'pm',
      },
      {
        title: '所属项目',
        dataIndex: 'project',
      },
      {
        title: '出勤',
        dataIndex: 'work_report.work_days',
      },
      {
        title: '加班',
        dataIndex: 'work_report.extra_work_days',
      },
      {
        title: '倒休',
        dataIndex: 'work_report.shift_days',
      },
      {
        title: '请假',
        dataIndex: 'work_report.leave_days',
      },
      {
        title: '旷工',
        dataIndex: 'work_report.absent_days',
      },
      {
        title: '工时确认',
        dataIndex: 'work_report.status',
        render: status => {
          if (status === 'checked') {
            return '是';
          }
          return '否';
        },
      },
      {
        title: '服务费',
        dataIndex: 'company_pay',
      },
      {
        title: '操作',
        render: data => (
          <Fragment>
            <a onClick={() => this.toDetail(data.engineer_id)}>查看</a>
          </Fragment>
        ),
      },
    ];
    const action = (
      <Fragment>
        <Button type="primary" onClick={this.sendBill} disabled={!canSendBill}>
          发出结算单
        </Button>
        <Button type="primary" onClick={this.payments}>
          导出工时结算单
        </Button>
      </Fragment>
    );
    const title = (
      <div>
        <MonthPicker
          defaultValue={moment(year_month, 'YYYYMM')}
          placeholder="选择月份"
          format="YYYYMM"
          onChange={(moment, date) => this.getSearch(date)}
          allowClear={false}
        />
        <span className={styles.totalMoney}>共发生金额：{monthPay} 元</span>
      </div>
    );
    return (
      <PageHeaderWrapper title={title} action={action}>
        <Card bordered={false}>
          <div>
            <Table
              loading={loading}
              // rowSelection={rowSelection}
              columns={columns}
              rowKey={record => record.id}
              dataSource={list.data}
              // dataSource={dataSource}
              // onChange={this.handleChange} // 点击分页回掉事件
              pagination={{ ...pagination }} // 分页配置
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ManHourManagement;

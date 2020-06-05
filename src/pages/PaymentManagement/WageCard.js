/* eslint-disable no-console */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Icon, Button, Modal, message } from 'antd';
import PeopleDetail from '@/components/PeopleDetail';
import Total from './Total';

const companyPay = {
  0: '按日计费',
  1: '按月计费',
};

const isPaid = {
  paid: '已',
  unpaid: '待',
};

const { confirm } = Modal;

@connect(({ payment }) => ({
  total: payment.total,
}))
class WageCard extends PureComponent {
  static defaultProps = {
    details: { payments: [], statistic: {}, year_month: new Date() },
    onSuccess: () => {},
    type: 'paid',
  };

  state = {
    totalDisplay: 'none',
  };

  componentDidMount() {
    this.getTotalInfo();
  }

  // total
  getTotalInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'payment/getTotal',
      payload: {
        schema: 'CompanyDefaultSchema',
      },
    });
  };

  // table icon
  expandIcon = props => {
    const { expanded } = props;
    return <Icon onClick={e => props.onExpand(props.record, e)} type={expanded ? 'up' : 'down'} />;
  };

  sendBill = () => {
    const {
      dispatch,
      onSuccess,
      details: { year_month }, // eslint-disable-line
    } = this.props;

    dispatch({
      type: 'workReports/sendBill',
      payload: {
        year_month: moment(new Date(year_month)).format('YYYYMM'),
      },
      callback: response => {
        if (response) {
          message.success('付款成功');
        } else {
          message.error('错误');
        }
        onSuccess();
      },
    });
  };

  showConfirm = () => {
    const {
      details: { year_month }, // eslint-disable-line
    } = this.props;
    const orderDate = moment(new Date(year_month)).format('YYYY年MM月');

    const sendBillFuc = this.sendBill;
    confirm({
      title: '确认付款',
      content: `是否确认付款${orderDate}账单`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        sendBillFuc();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 显示total
  showTotal = display => {
    this.setState({
      totalDisplay: display,
    });
  };

  render() {
    const {
      details: {
        year_month = new Date(), // eslint-disable-line
        created,
        payments = [],
        statistic = {},
      } = {},
      type,
      total = {},
    } = this.props;
    const buttonGroup = (
      <div>
        <Button type="primary" onClick={() => this.showConfirm(year_month)}>
          确认付款
        </Button>
      </div>
    );
    const conformTime = `确认付款时间：
    ${created && moment(new Date(created)).format('YYYY年MM月DD日 HH:mm')}`;
    const orderDate = moment(new Date(year_month)).format('YYYY年MM月');
    const { totalDisplay } = this.state;
    const title = (
      <div>
        <h3>
          {`${orderDate}${isPaid[type]}确认付款`}
          <Icon
            type="info-circle"
            onClick={() => {
              this.showTotal('block');
            }}
            style={{ marginLeft: '15px' }}
          />
        </h3>
      </div>
    );
    const titleColumn = [
      {
        title: '人员数量',
        dataIndex: 'count',
        align: 'center',
      },

      {
        title: '总平台服务费用',
        dataIndex: 'service_fee',
        align: 'center',
      },

      {
        title: '总平台招聘人数',
        dataIndex: 'use_hr_count',
        align: 'center',
      },
      {
        title: '总平台招聘费',
        dataIndex: 'hr_fee',
        align: 'center',
        render: fee => fee.toFixed(2),
      },

      {
        title: '总税金费',
        dataIndex: 'tax',
        align: 'center',
        render: fee => fee.toFixed(2),
      },

      {
        title: '总金融费',
        dataIndex: 'finance_fee',
        align: 'center',
        render: fee => fee.toFixed(2),
      },
      {
        title: '总工位费',
        // dataIndex: 'payment[0].station_salary',
        align: 'center',
        render: () => (payments[0] ? payments[0].station_salary.toFixed(2) : 0),
      },
      {
        title: '总人员服务费',
        dataIndex: 'company_pay',
        align: 'center',
        render: fee => fee.toFixed(2),
      },
    ];

    const detailColumn = [
      {
        title: '姓名',
        dataIndex: 'engineer.real_name',
        align: 'center',
      },
      {
        title: '项目',
        dataIndex: 'career.project',
        align: 'center',
      },
      {
        title: '项目经理',
        dataIndex: 'career.pm',
        align: 'center',
      },
      {
        title: '计费模式',
        dataIndex: 'career.salary_type',
        // eslint-disable-next-line no-shadow
        render: type => companyPay[type],
        align: 'center',
      },
      {
        title: '单价',
        dataIndex: 'position_level.money',
        align: 'center',
      },
      {
        title: '出勤(h)',
        dataIndex: 'work_report.work_duration',
        align: 'center',
      },
      {
        title: '人员服务费',
        dataIndex: 'company_pay',
        align: 'center',
        render: fee => fee.toFixed(2),
      },
      {
        title: '相关操作',
        render: data => {
          return <PeopleDetail id={data.engineer.id} year_month={data.year_month} />;
        },
      },
    ];

    return (
      <Fragment>
        <Card
          title={title}
          extra={created ? conformTime : buttonGroup}
          style={{ marginBottom: 10 }}
        >
          <Table
            columns={titleColumn}
            dataSource={[statistic]}
            pagination={false}
            expandIcon={this.expandIcon}
            rowKey={record => record.id}
            size="small"
            expandedRowRender={() => (
              <Card>
                <Table
                  size="small"
                  columns={detailColumn}
                  dataSource={payments}
                  rowKey={record => record.id}
                  pagination={false}
                />
              </Card>
            )}
          />
        </Card>
        <Total totalDisplay={totalDisplay} showTotal={this.showTotal} total={total} />
      </Fragment>
    );
  }
}

export default WageCard;

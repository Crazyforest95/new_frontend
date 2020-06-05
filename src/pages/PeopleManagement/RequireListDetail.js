import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import get from 'lodash/get';
import moment from 'moment';
import round from 'lodash/round';
import { Form, Card, Table, Button, Row, Col, Modal, Divider, Tooltip, Icon } from 'antd';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';
import { Pie } from '@/components/Charts';
import OrderDetail from '@/pages/EntryManagement/OrderDetail';
import CreateOrder from '@/pages/EntryManagement/CreateOrder';
import ChangeOrderRenew from './ChangeOrderRenew';
import DailyLog from './DailyLog';

import styles from './style.less';

const status = {
  0: '进行中',
  1: '已结束',
  2: '待开始',
};

const text = '采购订单进度按照每月22个工作日为基础计算，具体请以实际发生为准。';

const autoRenew = {
  0: '自动续签',
  1: '手动续签',
};

const renewCycle = {
  0: '',
  3: '（3个月）',
  6: '（6个月）',
  12: '（一年）',
};

@connect(({ requirementManagement, menu, loading }) => ({
  list: requirementManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['requirementManagement/getList'], // 是否加载loading
}))
@Form.create()
class RequireDetailList extends PureComponent {
  state = {
    page: 1,
    per_page: 10,
  };

  componentDidMount() {}

  rate = (start, end) => {
    if (!start || !end) {
      return 0;
    }

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const currentTime = new Date().getTime();

    const disTime = (currentTime - startTime) / (endTime - startTime);
    if (disTime <= 0) {
      return 0;
    } else if (disTime > 1) {
      return 100;
    }
    return round(disTime * 100);
  };

  delete = id => {
    Modal.confirm({
      // title: 'This is an error message',
      content: '确定删除需求吗？',
      onOk: () => this.deletes(id),
      okText: '确定',
      cancelText: '取消',
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

  // 获取列表
  getList = () => {
    const urlParams = new URL(window.location.href);
    const redirect = urlParams.searchParams.get('id');
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'requirementManagement/getList',
      payload: {
        ...this.state,
        company_id: redirect || companyId,
        sort_id: -1,
      },
    });
  };

  render() {
    const { nowCareer = {}, orderList = [], loading, id, careerId, onSuccess } = this.props;

    const pagination = { pageSize: 10, total: orderList.length };
    /*eslint-disable*/
    const columns = [
      {
        title: '采购订单时间',
        render: ({ start_date, end_date }) => {
          const startDate = moment(start_date).format('YYYY年MM月DD日');
          const endDate = moment(end_date).format('YYYY年MM月DD日');
          return `${startDate}至${endDate}`;
        },
      },
      {
        title: '采购订单状态',
        dataIndex: 'status',
        render: i => status[i],
      },
      {
        title: (
          <div>
            采购订单进度
            <Tooltip placement="topLeft" title={text}>
              <Icon type="question-circle" />
            </Tooltip>
          </div>
        ),
        render: all => `${this.rate(all.start_date, all.end_date)}%`,
      },
      {
        title: '操作',
        align: 'center',
        render: ({ id: orderId, start_date, end_date }) => {
          const startDate = moment(start_date).format('YYYY年MM月DD日');
          const endDate = moment(end_date).format('YYYY年MM月DD日');
          const date = `${startDate}至${endDate}`;
          return (
            <Fragment>
              <OrderDetail id={orderId} />
              <Divider type="vertical" />
              <DailyLog id={orderId} date={date} />
            </Fragment>
          );
        },
      },
    ];

    console.log(orderList);
    return (
      <>
        <Card bordered={false}>
          <div>
            <AsyncLoadBizCharts>
              <Row align="middle" justify="center" gutter={20}>
                <Col span={3} className={styles.chartBorder}>
                  <Pie
                    percent={this.rate(orderList[0].start_date, orderList[0].end_date)}
                    total={`${this.rate(orderList[0].start_date, orderList[0].end_date)}%`}
                    height={100}
                  />
                  <ChangeOrderRenew
                    text={`${autoRenew[get(nowCareer, 'auto_renew', 0)]} ${renewCycle[
                      get(nowCareer, 'renew_cycle', 0)
                    ] || ''}`}
                    id={careerId}
                    onSuccess={onSuccess}
                    authRenew={get(nowCareer, 'auto_renew', 0)}
                    renewCycle={get(nowCareer, 'renew_cycle', 0)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CreateOrder
                      text={<Button type="primary">续签</Button>}
                      title="续签采购订单"
                      engineerId={id}
                      onSuccess={onSuccess}
                      isRenew={false}
                    />
                  </div>
                </Col>
                <Col span={21}>
                  <div className={styles.detailCard}>
                    <Table
                      loading={loading}
                      // rowSelection={rowSelection}
                      columns={columns}
                      rowKey={record => record.id}
                      // dataSource={list.data}
                      dataSource={orderList.reverse()}
                      onChange={this.handleChange} // 点击分页回掉事件
                      pagination={{ ...pagination }} // 分页配置
                    />
                  </div>
                </Col>
              </Row>
            </AsyncLoadBizCharts>
          </div>
        </Card>
      </>
    );
  }
}

export default RequireDetailList;

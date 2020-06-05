import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Menu, Table, Steps, Icon, Row, Col, Modal, Dropdown } from 'antd';
import { routerRedux } from 'dva/router';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';
import { Pie } from '@/components/Charts';

import styles from './style.less';

const { Step } = Steps;

const status = {
  1: {
    actionName: '评定筛选结果',
    action: [{ name: '约面试', value: 1 }, { name: '淘汰', value: 2 }],
  },
  2: {
    actionName: '更改筛选结果',
    action: [{ name: '约面试', value: 1 }],
  },
  3: {
    actionName: '评定面试结果',
    action: [
      { name: '未面试', value: 1 },
      { name: '待定', value: 2 },
      { name: '未通过', value: 3 },
      { name: '通过', value: 4 },
    ],
  },
  4: {
    actionName: '评定面试结果',
    action: [
      { name: '未面试', value: 1 },
      { name: '未通过', value: 3 },
      { name: '通过', value: 4 },
    ],
  },
  5: {
    actionName: '更改面试结果',
    action: [{ name: '约面试', value: 1 }],
  },
  6: {
    actionName: '评定面试结果',
    action: [{ name: '待定', value: 1 }, { name: '通过', value: 1 }],
  },
};

@connect(({ requirementManagement, menu, loading }) => ({
  list: requirementManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['requirementManagement/getList'], // 是否加载loading
}))
@Form.create()
class RequireDetailList extends PureComponent {
  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 10,
  };

  componentDidMount() {
    this.getList();
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 查询
  getSearch = () => {
    this.setState(
      {
        page: 1,
        per_page: 10,
      },
      () => this.getList()
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

  // 点击管理跳转
  toRequirementDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/requirementManagement/requirementDetail?id=${id}`));
  };

  rate = (need, all) => {
    const rate = Math.round((need / all) * 100);
    if (rate >= 100) {
      return 100;
    }
    if (need === 0 && all === 0) {
      return 0;
    }
    return Math.round((need / all) * 100);
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

  render() {
    const { list, loading } = this.props;
    // const { selectedRowKeys } = this.state;
    const pagination = { pageSize: 10, total: list.page_info.total };
    const menu = (
      <Menu>
        <Menu.Item>约面试</Menu.Item>
        <Menu.Item>淘汰</Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '性别',
        dataIndex: 'gender',
      },
      {
        title: '简历状态',
        dataIndex: 'pm.real_name',
      },
      {
        title: '操作',
        align: 'center',
        render: () => (
          <Fragment>
            <Dropdown overlay={menu}>
              <a>
                {status[1].actionName} <Icon type="down" />
              </a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];

    return (
      <>
        <Card bordered={false}>
          <div>
            <AsyncLoadBizCharts>
              <Row align="middle" justify="center">
                <Col span={3} className={styles.chartBorder}>
                  <Pie percent={this.rate(1, 2)} total={`${1}/${2}`} height={100} />
                </Col>
                <Col span={21}>
                  <Steps current={7} labelPlacement="vertical">
                    <Step title="待筛选" description="12" icon={<Icon type="right-circle" />} />
                    <Step
                      title="简历筛选淘汰"
                      description="36"
                      icon={<Icon type="right-circle" />}
                    />
                    <Step title="等待面试" description="23" icon={<Icon type="right-circle" />} />
                    <Step
                      title="面试结果待定"
                      description="12"
                      icon={<Icon type="right-circle" />}
                    />
                    <Step title="未参加面试" description="12" icon={<Icon type="right-circle" />} />
                    <Step title="面试未通过" description="12" icon={<Icon type="right-circle" />} />
                    <Step title="面试通过" description="12" icon={<Icon type="right-circle" />} />
                  </Steps>
                  <div className={styles.detailCard}>
                    <Table
                      loading={loading}
                      // rowSelection={rowSelection}
                      columns={columns}
                      rowKey={record => record.id}
                      // dataSource={list.data}
                      dataSource={[{ id: 12 }]}
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

import React, { Fragment } from 'react';
import { Modal, Table, Divider } from 'antd';
import { connect } from 'dva/index';
import moment from 'moment/moment';

const totalColumns = [
  {
    title: '采购订单时间',
    dataIndex: 'date',
    align: 'center',
  },
  {
    title: '出勤天数',
    render: data => data.work_days || 0,
    align: 'center',
  },
  {
    title: '休息天数',
    render: data => data.rest_days || 0,
    align: 'center',
  },
  {
    title: '加班天数',
    render: data => data.extra_work_days || 0,
    align: 'center',
  },
  {
    title: '请假天数',
    render: data => data.leave_days || 0,
    align: 'center',
  },
  {
    title: '倒休天数',
    render: data => data.shift_days || 0,
    align: 'center',
  },
  {
    title: '旷工天数',
    render: data => data.absent_days || 0,
    align: 'center',
  },
];

const detailColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    align: 'center',
    render: date => moment(date).format('YYYY年MM月DD日'),
  },
  {
    title: '内容',
    dataIndex: 'content',
    align: 'center',
    width: '40%',
  },
  {
    title: '时长(h)',
    dataIndex: 'duration',
    align: 'center',
  },
  {
    title: '备注',
    dataIndex: 'note',
    align: 'center',
  },
];

@connect(({ enterProjects, loading }) => ({
  engineerOrder: enterProjects.engineerOrder,
  loading: loading.effects['enterProjects/getEngineerOrder'], // 是否加载loading
}))
class Detail extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.getList();
  };

  handleCancel = () => {
    const { dispatch } = this.props;

    this.setState({
      visible: false,
    });
    dispatch({
      type: 'enterProjects/clearEngineerOrder',
    });
  };

  // 获取列表
  getList = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'enterProjects/getEngineerOrder',
      payload: {
        id,
        schema: 'OrderWithDailyLogs',
      },
    });
  };

  render() {
    const { visible } = this.state;
    /* eslint-disable */
    const {
      engineerOrder: { daily_logs, statistics },
      date,
      loading,
    } = this.props;

    /* eslint-enable */
    const pagination = { pageSize: 10, total: daily_logs.length };
    return (
      <Fragment>
        <span>
          <a type="plus-circle" onClick={this.showModal}>
            工时详情
          </a>
        </span>
        <Modal
          title="工时详情"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={850}
          destroyOnClose
          maskClosable={false}
          footer={null}
        >
          <Table
            columns={totalColumns}
            rowKey={record => record.id}
            // dataSource={list.data}
            dataSource={[{ ...statistics, date }]}
            pagination={false}
            loading={loading}
          />
          <Divider dashed />
          <Table
            columns={detailColumns}
            rowKey={record => record.id}
            // dataSource={list.data}
            dataSource={daily_logs} // eslint-disable-line
            pagination={{ ...pagination }} // 分页配置
            onChange={this.handleChange} // 点击分页回掉事件
            loading={loading}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default Detail;

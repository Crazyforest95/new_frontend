import React from 'react';
import moment from 'moment';
import { Modal, Table, Button } from 'antd';
import { connect } from 'dva/index';

const workExperienceColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
  },
];

@connect(({ dailyLogs, loading }) => ({
  list: dailyLogs.list,
  loading: loading.effects['dailyLogs/getList'],
}))
class Daily extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.details();
  };

  details = () => {
    const { dispatch, detail } = this.props;
    const yearMonth = moment(`${detail.year_month}01`).format('YYYY-MM');

    dispatch({
      type: 'dailyLogs/getList',
      payload: {
        engineer_id: detail.engineer_id,
        gt_date: `${yearMonth}-00`,
        lt_date: `${yearMonth}-32`,
      },
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    const { list, loading, detail } = this.props;
    const yearMonth = moment(`${detail.year_month}01`).format('YYYY-MM');
    return (
      <span>
        <Button type="primary" onClick={this.showModal}>
          查看日报
        </Button>
        <Modal
          title={`${detail.engineer.real_name} ${yearMonth}`}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          destroyOnClose
          footer={null}
        >
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={list.data}
            columns={workExperienceColumns}
          />
        </Modal>
      </span>
    );
  }
}

export default Daily;

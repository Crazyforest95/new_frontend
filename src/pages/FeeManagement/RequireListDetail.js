import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table } from 'antd';

@connect(({ requirementManagement, menu, loading }) => ({
  list: requirementManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['requirementManagement/getList'], // 是否加载loading
}))
@Form.create()
class RequireDetailList extends PureComponent {
  render() {
    const { levelList } = this.props;
    // const { selectedRowKeys } = this.state;
    const pagination = { pageSize: 10, total: levelList.length };
    const columns = [
      {
        title: '级别',
        dataIndex: 'name',
      },
      {
        title: '价格',
        dataIndex: 'money',
      },
      {
        title: '人员数量',
        dataIndex: 'engineer_count',
      },
    ];

    return (
      <>
        <Table
          // loading={loading}
          // rowSelection={rowSelection}
          columns={columns}
          rowKey={record => record.id}
          // dataSource={list.data}
          dataSource={levelList}
          // onChange={this.handleChange} // 点击分页回掉事件
          pagination={{ ...pagination }} // 分页配置
        />
      </>
    );
  }
}

export default RequireDetailList;

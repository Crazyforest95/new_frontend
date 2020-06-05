import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Modal } from 'antd';

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
    const columns = [
      {
        title: '级别',
        dataIndex: 'level',
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        title: '人员数量',
        dataIndex: 'count',
      },
    ];

    return (
      <>
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
      </>
    );
  }
}

export default RequireDetailList;

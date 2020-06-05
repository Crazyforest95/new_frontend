import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, message, Modal, Icon, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Add from './Add';
import Update from './Update';
import RequireListDetail from './RequireListDetail';

const ways = {
  day: '日',
  month: '月',
};

@connect(({ levelManagement, menu, loading }) => ({
  list: levelManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['levelManagement/getList'], // 是否加载loading
}))
@Form.create()
class LevelManagement extends PureComponent {
  static defaultProps = {
    way: 'day',
  };

  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 10,
  };

  componentDidMount() {
    // 传入页面ID
    // const urlParams = new URL(window.location.href);
    // const redirect = urlParams.searchParams.get('id');
    // console.log(redirect);
    this.getList();
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 查询
  getSearch = data => {
    this.setState(
      {
        usernameOrPhone: data,
        page: 1,
        per_page: 10,
      },
      () => this.getList()
    );
  };

  // 获取列表
  getList = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'levelManagement/getList',
      payload: {
        ...this.state,
        company_id: companyId,
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

  // 添加
  add = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'levelManagement/add',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
        } else {
          message.error('错误');
        }
        this.getList();
      },
    });
  };

  // 删除
  deletes = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'levelManagement/delete',
      payload: {
        id,
      },
      callback: datas => {
        if (datas) {
          message.success('删除成功');
        } else {
          message.error('错误');
        }
        this.getList();
      },
    });
  };

  delete = id => {
    Modal.confirm({
      // title: 'This is an error message',
      content: '确定删除吗？',
      onOk: () => this.deletes(id),
      okText: '确定',
      cancelText: '取消',
    });
  };

  // table icon
  expandIcon = props => {
    const { expanded } = props;
    return <Icon onClick={e => props.onExpand(props.record, e)} type={expanded ? 'up' : 'down'} />;
  };

  render() {
    const { list, loading, way } = this.props;
    // const { selectedRowKeys } = this.state;
    const pagination = { pageSize: 10, total: list.page_info.total };
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };
    const columns = [
      {
        title: '职位',
        dataIndex: 'position',
      },
      {
        title: '级别',
        dataIndex: 'name',
      },
      {
        title: '人员数量',
        dataIndex: 'number',
      },
      {
        title: '操作',
        render: data => (
          <Fragment>
            <a onClick={() => this.delete(data.id)}>删除</a>
            <Divider type="vertical" />
            <Update way={ways[way]} onSuccess={this.getList} />
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card title={`按${ways[way]}计费`} extra={<Add onSuccess={this.getList} way={ways[way]} />}>
          <div>
            <Table
              loading={loading}
              // rowSelection={rowSelection}
              columns={columns}
              rowKey={record => record.id}
              dataSource={list.data}
              expandedRowRender={() => <RequireListDetail />}
              expandIcon={this.expandIcon}
              onChange={this.handleChange} // 点击分页回掉事件
              pagination={{ ...pagination }} // 分页配置
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default LevelManagement;

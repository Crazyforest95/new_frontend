import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, message, Modal, Icon, Divider, Button } from 'antd';
import Add from './Add';
import Update from './Update';
import RequireListDetail from './RequireListDetail';
import { getList } from '@/services/positionManagement';

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
class FeeManagement extends PureComponent {
  static defaultProps = {
    way: 'day',
  };

  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 10,
    list: { data: [], page_info: {} },
  };

  componentDidMount() {
    // 传入页面ID
    // const urlParams = new URL(window.location.href);
    // const redirect = urlParams.searchParams.get('id');
    // console.log(redirect);
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
    /* eslint-disable */
    const { page, per_page } = this.state;
    /* eslint-disable */
    const { way } = this.props;
    const params = {
      page,
      per_page,
      schema: 'PositionWithLevelsSchema',
      salary_type: way === 'day' ? 0 : 1,
    };
    getList(params).then(res => {
      if (res) {
        this.setState({
          list: res,
        });
      }
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
      type: 'positionManagement/delete',
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
    const { list } = this.state;
    const { way } = this.props;
    // const { selectedRowKeys } = this.state;
    const pagination = { pageSize: 10, total: list.page_info.total };
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };
    const columns = [
      {
        title: '职位',
        dataIndex: 'name',
      },
      {
        title: '级别数量',
        dataIndex: 'position_levels',
        render: i => i.length,
      },
      {
        title: '人员数量',
        dataIndex: 'engineer_count',
      },
      {
        title: '操作',
        render: data => (
          <Fragment>
            <a onClick={() => this.delete(data.id)}>删除</a>
            <Divider type="vertical" />
            <Update details={data} way={ways[way]} onSuccess={this.getList} />
          </Fragment>
        ),
      },
    ];

    return (
      <Card
        title={`按${ways[way]}计费`}
        extra={
          <Add
            text={
              <Button type="primary" icon="plus-circle">
                增加
              </Button>
            }
            onSuccess={this.getList}
            way={ways[way]}
          />
        }
      >
        <div>
          <Table
            // loading={loading}
            // rowSelection={rowSelection}
            columns={columns}
            rowKey={record => record.id}
            dataSource={list.data}
            expandedRowRender={i => <RequireListDetail levelList={i.position_levels} />}
            expandIcon={this.expandIcon}
            onChange={this.handleChange} // 点击分页回掉事件
            pagination={{ ...pagination }} // 分页配置
          />
        </div>
      </Card>
    );
  }
}

export default FeeManagement;

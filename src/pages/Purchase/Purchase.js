import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Dropdown, Table, message, Modal, Icon, Menu } from 'antd';
// import styles from './style.less';
import Add from './Add';
import Update from './Update';
import ChangePassword from './ChangePassword';
import { active } from '@/services/purchase';

@connect(({ purchase, menu, loading }) => ({
  list: purchase.list,
  companyId: menu.companyId,
  loading: loading.effects['purchase/getList'], // 是否加载loading
}))
@Form.create()
class Purchase extends PureComponent {
  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 100000,
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
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'purchase/getList',
      payload: {
        ...this.state,
        company_id: companyId,
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

  // 删除
  deletes = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchase/delete',
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

  // 是否启用
  changeStatus = (id, status) => {
    const sendParam = { id, activate: status ? 0 : 1, schema: 'BaseUserPut' };

    active(sendParam).then(res => {
      if (res) {
        message.success('修改成功');
      } else {
        message.error('错误');
      }
      this.getList();
    });
  };

  enabled = data => {
    Modal.confirm({
      // title: 'This is an error message',
      content: `确定${data.activate ? '账号禁用' : '账号启用'}吗？`,
      onOk: () => this.changeStatus(data.id, data.activate),
      okText: '确定',
      cancelText: '取消',
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

  menu = data => {
    return (
      <Menu>
        <Menu.Item>
          <ChangePassword data={data} onSuccess={this.getList} />
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.enabled(data)}>{data.activate ? '账号禁用' : '账号启用'}</a>
        </Menu.Item>
        <Menu.Item>
          <Update id={data.id} onSuccess={this.getList} />
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.delete(data.id)}>删除</a>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { list, loading } = this.props;
    const pagination = { pageSize: 10, total: list.page_info.total };
    const columns = [
      {
        title: '姓名',
        dataIndex: 'real_name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '账号状态',
        dataIndex: 'activate',
        render: status => (status ? '正常' : '禁用'),
      },
      {
        title: '操作',
        render: data => (
          <Fragment>
            <Dropdown overlay={this.menu(data)}>
              <a>
                <Icon type="more" />
              </a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];

    const isOPen = list.data.filter(item => item.activate);
    return (
      <>
        <Card
          bordered={false}
          title={
            <>
              <Add onSuccess={this.getList} /> 采购人员
              {`（${isOPen.length}/${list.page_info.total}）`}
            </>
          }
        >
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
      </>
    );
  }
}

export default Purchase;

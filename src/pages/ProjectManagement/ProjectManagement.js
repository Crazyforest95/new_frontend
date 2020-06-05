import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Dropdown, Table, message, Modal, Icon, Menu, Tooltip } from 'antd';
// import styles from './style.less';
import Add from './Add';
import Update from './Update';
import ChangePassword from './ChangePassword';
import IsEnabled from './IsEnabled';

@connect(({ projectManagement, menu, loading }) => ({
  list: projectManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
@Form.create()
class ProjectManagement extends PureComponent {
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
      type: 'projectManagement/getList',
      payload: {
        ...this.state,
        company_id: companyId,
        sort_id: -1,
        schema: 'PmWithProjects',
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
      type: 'projectManagement/delete',
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

  enabled = (id, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/changeStatus',
      payload: {
        id,
        schema: 'BaseUserPut',
        activate: data ? 1 : 0,
      },
      callback: datas => {
        if (datas) {
          message.success('修改成功');
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

  menu = data => {
    return (
      <Menu>
        <Menu.Item>
          <ChangePassword data={data} onSuccess={this.getList} />
        </Menu.Item>
        <Menu.Item>
          <IsEnabled
            onSuccess={this.getList}
            activate={data.activate}
            pmName={data.real_name}
            id={data.id}
          />
        </Menu.Item>
        <Menu.Item>
          <Update id={data.id} onSuccess={this.getList} />
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.delete(data.id)} style={{color:'#1890FF'}}>删除</a>
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
        title: '管理项目',
        dataIndex: 'project',
        render: project => (
          <Tooltip placement="topLeft" title={project && project.join(',')}>
            {project && project.length ? `${project[0]}` : ''}
            {project && project.length > 1 && '...'}
          </Tooltip>
        ),
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
              <Add onSuccess={this.getList} /> 项目经理
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

export default ProjectManagement;

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Card, Table, message, Tooltip, Modal, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './style.less';
import Add from './Add';
import Update from './Update';

@connect(({ projects, loading }) => ({
  list: projects.list,
  loading: loading.effects['projects/getList'], // 是否加载loading
}))
@Form.create()
class Project extends PureComponent {
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
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/getList',
      payload: { ...this.state, schema: 'ProjectWithPms' },
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

  // 修改
  update = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchase/update',
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
  deleteFuc = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/delete',
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

  delete = (id, e) => {
    if (e && e.stopPropagation) {
      // 因此它支持W3C的stopPropagation()方法
      e.stopPropagation();
    } else {
      // 否则，我们需要使用IE的方式来取消事件冒泡
      window.event.cancelBubble = true;
    }

    Modal.confirm({
      // title: 'This is an error message',
      content: '确定删除吗？',
      onOk: () => this.deleteFuc(id),
      okText: '确定',
      cancelText: '取消',
    });
  };

  toDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/projectManager/projectDetail/${id}`));
  };

  render() {
    const { list, loading } = this.props;
    // const { selectedRowKeys } = this.state;
    const pagination = { pageSize: 10, total: list.page_info.total };
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        render: (data, all, index) => {
          return index + 1;
        },
      },
      {
        title: '项目名称',
        dataIndex: 'name',
      },
      {
        title: '项目经理',
        dataIndex: 'pms',
        render: pms => (
          <Tooltip
            placement="topLeft"
            title={pms.length > 0 && pms.map(i => <span>{i.real_name} &nbsp;</span>)}
          >
            {pms && pms[0] && pms[0].real_name} {pms.length > 1 && '...'}
          </Tooltip>
        ),
      },
      {
        title: '人员数量',
        dataIndex: 'engineer_count',
      },
      {
        title: '操作',
        render: data => (
          <Fragment>
            <Update id={data.id} name={data.name} onSuccess={this.getList} />
            <Divider type="vertical" />
            <a onClick={e => this.delete(data.id, e)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={
            <>
              <Add onSuccess={this.getList} /> 项目管理
            </>
          }
        >
          <div>
            <Table
              loading={loading}
              // rowSelection={rowSelection}
              onRow={record => {
                return {
                  onClick: () => {
                    this.toDetail(record.id);
                  }, // 点击行
                };
              }}
              columns={columns}
              rowKey={record => record.id}
              dataSource={list.data}
              // dataSource={dataSource}
              onChange={this.handleChange} // 点击分页回掉事件
              pagination={{ ...pagination }} // 分页配置
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Project;

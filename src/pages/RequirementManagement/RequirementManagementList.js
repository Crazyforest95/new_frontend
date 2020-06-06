import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Row, Col, message, Icon, Modal, Select, Button, Typography } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// cobra-55555 -20-04-15
import DropdownMenu from '@/components/DropdownMenu';
// // // // //
import styles from './style.less';
import RequirementCard from './RequirementCard'
import Add from './Add';
import Update from './Update';
import Close from './Close';

const { Option } = Select;
const { Text } = Typography;

@connect(({ requirementManagement, menu, loading }) => ({
  list: requirementManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['requirementManagement/getList'], // 是否加载loading
}))
@Form.create()
class RequirementManagementList extends PureComponent {
  state = {
    page: 1,
    // per_page: 10,
    // status: 'open',
  };

  hide_unreadnums = false;

  componentDidMount() {
    this.getSearch('open');
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 查询
  getSearch = status => {
    this.setState(
      {
        page: 1,
        // per_page: 10,
        status,
      },
      () => this.getList()
    );
  };

  // 获取列表
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'requirementManagement/getList',
      payload: {
        ...this.state,
        sort_id: -1,
        schema: 'OfferDefaultSchemaWithStatistics',
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
      type: 'requirementManagement/add',
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

  // 修改
  update = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'requirementManagement/update',
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
      type: 'requirementManagement/delete',
      payload: {
        id,
      },
      callback: datas => {
        if (datas) {
          message.success('删除成功');
        } else {
          message.error(datas.error.message);
        }
        this.getList();
      },
    });
  };

  // cobra-55555 -20-04-15
  // 点击管理跳转
  toRequirementDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/requirementManagement/requirementDetail?id=${id}`));
  };

  // table icon
  expandIcon = props => {
    const { expanded } = props;
    return <Icon onClick={e => props.onExpand(props.record, e)} type={expanded ? 'up' : 'down'} />;
  };
  // // // // //

  delete = id => {
    Modal.confirm({
      // title: 'This is an error message',
      content: '确定删除需求吗？',
      onOk: () => this.deletes(id),
      okText: '确定',
      cancelText: '取消',
    });
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

  // cobra-55555 -20-04-16
  // remove un_read_number icon
  hide_unread_nums = () => {
    this.hide_unreadnums = true;
    this.getList();
  }
  // // // // //

  render() {
    const { list, loading } = this.props;
    const {
      statistics: {
        cv_pass_amount = 0,
        cv_push_amount = 0,
        demand_amount = 0,
        entry_amount = 0,
        interview_pass_amount = 0,
      },
    } = list;

    list.data.forEach(element => {
      element.un_read_counts = 5;
    });

    const pagination = { pageSize: 10, total: list.page_info.total };
    const columns = [
      {
        title: '需求名称',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '所属项目',
        dataIndex: 'project',
      },
      {
        title: '项目经理',
        dataIndex: 'pm.real_name',
      },
      {
        title: '需求人数',
        dataIndex: 'count',
        render: (data, all) => {
          return `${all.entry_amount}/${all.amount}`;
        },
      },
      {
        title: '简历需求比',
        render: all => {
          return `${all.cv_push_amount}/${all.amount}`;
        },
      },
      {
        title: '简历通过率',
        render: all => {
          return this.rate(all.cv_pass_amount, all.cv_push_amount) + '%';
        },
      },
      {
        title: '面试通过率',
        render: all => {
          return this.rate(all.interview_pass_amount, all.cv_pass_amount) + '%';
        },
      },
      {
        title: '满足率',
        dataIndex: 'rate',
        render: (data, all) => {
          return `${Math.round((all.entry_amount / all.amount) * 100)}%`;
        },
      },
      {

        title: '操作',
        align: 'center',
        render: data => {
          const colse =
            data.status === 'open' ? <Close id={data.id} onSuccess={this.getList} /> : null;
          return (
            <Fragment>
              <DropdownMenu
                menuList={[
                  colse,
                  <a onClick={() => this.delete(data.id)} style={{ color: '#1890FF' }}>删除</a>,
                  <Update id={data.id} onSuccess={this.getList} />,
                ]}
              />
            </Fragment>
          );
        },
      },
    ];

    // // // // //

    const title = (
      <div>
        <Select defaultValue="open" style={{ width: 220 }} onChange={this.getSearch}>
          <Option value="open">进行中的需求</Option>
          <Option value="closed">已完成的需求</Option>
        </Select>
      </div>
    );

    return (
      <PageHeaderWrapper title={title}>
        <Card title="整体需求情况" bordered={false} style={{ marginBottom: 20 }}>
          <div className={styles.requirementAll}>
            <div className={styles.cardList}>
              <div>需求总人数</div>
              <div>{demand_amount}</div>
            </div>
            <div className={styles.cardList}>
              <div>简历需求比</div>
              <div>{`${cv_push_amount}/${demand_amount}`}</div>
            </div>
            <div className={styles.cardList}>
              <div>简历通过率</div>
              <div>{this.rate(cv_pass_amount, cv_push_amount)}%</div>
            </div>
            <div className={styles.cardList}>
              <div>面试通过率</div>
              <div>{this.rate(interview_pass_amount, cv_pass_amount)}%</div>
            </div>
            <div className={styles.cardList}>
              <div>综合需求满足率</div>
              <div>{this.rate(entry_amount, demand_amount)}%</div>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          title={<Add add={this.add} onSuccess={this.getList} />}
          extra={<a style={{ color: '#2979FF' }} onClick={this.hide_unread_nums}>已读所有消息</a>}
        >
          <div>
            <RequirementCard lists={list.data} hide_unread_nums={this.hide_unreadnums} action={this.getList} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RequirementManagementList;

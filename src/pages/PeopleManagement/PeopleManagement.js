import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { Form, Card, Table, message, Icon, Tag, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Order from '@/pages/EntryManagement/OrderDetail'; // 采购订单
import Resume from '@/pages/EntryManagement/Resume'; // 简历
import ResumeDetails from '@/pages/EntryManagement/ResumeDetails'; // 入项材料
import PeopleDetail from '@/components/PeopleDetail'; // 人员详情
import DropdownMenu from '@/components/DropdownMenu';
import ChangePassword from './ChangePassword'; // 修改密码
import RequireListDetail from './RequireListDetail';

// import styles from './style.less';
import Add from './Add';
import Search from './Search';

const engineerStatus = {
  on_duty: '在项',
  leaving: '待出项',
};

const autoRenew = {
  0: '自动续签',
  1: '手动续签',
};

const nowCareer = {
  0: '按日计费',
  1: '按月计费',
};

const searchLable = {
  s_need_renew_order: '采购订单待等待续签',
  like_real_name: '姓名',
  like_phone: '手机号',
  status: '人员状态',
  project_id: '所属项目',
  pm_id: '项目经理',
  auto_renew: '采购订单签约形式',
  position_id: '职位',
  position_level_id: '级别',
  salary_type: '计费方式',
  gte_s_money: '最低价格',
  lte_s_money: '最高价格',
  gte_attitude_score: '最低态度分',
  lte_attitude_score: '最高态度分',
  gte_s_ability: '最低综合能力分',
  lte_s_ability: '最高综合能力分',
  use_hr_service: '招聘形式',
};

const MAX_PAGE = {
  page: 1,
  per_page: 100000,
};

@connect(({ careers, menu, loading }) => ({
  list: careers.list,
  companyId: menu.companyId,
  loading: loading.effects['careers/getList'], // 是否加载loading
}))
@Form.create()
class PeopleManagement extends PureComponent {
  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 10,
    searchValue: {},
  };

  componentDidMount() {
    const {
      location: { query },
    } = this.props;
    const haveQuery = isEmpty(query); // 判断是否有参数传入
    this.getSearchData();
    if (!haveQuery) {
      this.getList(query);
    } else {
      this.getList();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectManagement/restList',
    });
    dispatch({
      type: 'projects/restList',
    });
  }

  getSearchData = () => {
    this.getProject();
    this.getPm();
    this.getPosition();
    this.getLevel();
  };

  getPm = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectManagement/getList',
      payload: {
        ...MAX_PAGE,
      },
    });
  };

  getPosition = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'positionManagement/getList',
      payload: {
        ...MAX_PAGE,
      },
    });
  };

  getLevel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'levelManagement/getList',
      payload: {
        ...MAX_PAGE,
      },
    });
  };

  getProject = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/getList',
      payload: {
        ...MAX_PAGE,
      },
    });
  };

  // 查询
  getSearch = () => {
    this.setState(
      {
        // usernameOrPhone: data,
        page: 1,
        per_page: 10,
      },
      () => this.getList()
    );
  };

  // 获取列表
  getList = (search = { lt_status: 'finish' }) => {
    const { dispatch } = this.props;
    /*eslint-disable*/
    const { page, per_page } = this.state;
    /* eslint-enable */
    dispatch({
      type: 'careers/getList',
      payload: {
        page,
        per_page,
        sort_id: -1,
        schema: 'CareerManageSchema',
        ...search,
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
      type: 'customer/setAdd',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas.success) {
          message.success('提交成功');
        } else {
          message.error(datas.error.message);
        }
        this.getList();
      },
    });
  };

  // 修改
  update = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/setUpdate',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas.success) {
          message.success('提交成功');
        } else {
          message.error(datas.error.message);
        }
        this.getList();
      },
    });
  };

  // 删除
  deletes = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/setDelete',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas.success) {
          message.success('删除成功');
        } else {
          message.error(datas.error.message);
        }
        this.getList();
      },
    });
  };

  // 删除
  deletes = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/setDelete',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas.success) {
          message.success('删除成功');
        } else {
          message.error(datas.error.message);
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

  // 修改密码
  changePassword = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/changePassword',
      payload: {
        ...data,
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

  // table icon
  expandIcon = props => {
    const { expanded } = props;
    return <Icon onClick={e => props.onExpand(props.record, e)} type={expanded ? 'up' : 'down'} />;
  };

  render() {
    const { list, loading } = this.props;
    const { searchValue } = this.state;
    const pagination = { pageSize: 10, total: list.page_info.total };
    const columns = [
      {
        title: '姓名',
        dataIndex: 'engineer.real_name',
        align: 'center',
      },
      {
        title: '手机号码',
        dataIndex: 'phone',
        align: 'center',
      },
      {
        title: '工作状态',
        // dataIndex: 'engineer_status',
        // render: status => engineerStatus[status],
        render: data => data.orders[0].status === 2 ? '未到达入项时间' : engineerStatus[data.engineer_status],
        align: 'center',
      },
      {
        title: '所属项目',
        dataIndex: 'project',
        align: 'center',
      },
      {
        title: '项目经理',
        dataIndex: 'pm',
        align: 'center',
      },
      {
        title: '职位',
        dataIndex: 'position_level.position',
        align: 'center',
      },
      {
        title: '级别',
        dataIndex: 'position_level.name',
        align: 'center',
      },
      {
        title: '计费方式',
        dataIndex: 'salary_type',
        render: career => nowCareer[career],
        align: 'center',
      },
      {
        title: '单价',
        dataIndex: 'position_level.money',
        align: 'center',
      },
      {
        title: '综合态度分',
        render: data => data.attitude_score || 0,
        align: 'center',
      },
      {
        title: '综合能力分',
        render: data => data.ability_score || 0,
        align: 'center',
      },
      {
        title: '签约形式',
        dataIndex: 'auto_renew',
        render: auto => autoRenew[auto],
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: data => {
          const { id } = data.engineer;
          const menuList = [
            <Resume detail={get(data, 'engineer.cv_path', [])} />,
            <ChangePassword data={data} changePassword={this.changePassword} />,
            <PeopleDetail id={id} />,
            <Order engineerId={id} />,
            <ResumeDetails id={id} />,
          ];
          return (
            <Fragment>
              <DropdownMenu menuList={menuList} />
            </Fragment>
          );

          // <Fragment>
          //   <DropdownMenu />
          //   {/* <ChangePassword data={data} changePassword={this.changePassword} />
          //   <Divider type="vertical" />
          //   <Resume detail={get(data, 'cv_path', [])} /> */}
          // </Fragment>
        },
      },
    ];

    return (
      <PageHeaderWrapper title="人员管理">
        <Card
          title={<Add onSuccess={this.getList} />}
          bordered={false}
          extra={
            <div>
              <div style={{ display: 'flex', flex: 1, maxWidth: 800 }}>
                <div>
                  {Object.keys(searchValue).map((item, i) => (
                    <Tag key={i}>{`${searchLable[item]}:${searchValue[item]}`}</Tag>
                  ))}
                </div>
                <Search
                  onSearch={this.getList}
                  searchChange={project => this.setState({ searchValue: project })}
                />
              </div>
            </div>
          }
        >
          <div>
            <Table
              loading={loading}
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={list.data.filter(item => item.engineer_status !== 'finish')}
              // dataSource={list.data}
              onChange={this.handleChange} // 点击分页回掉事件
              pagination={{ ...pagination }} // 分页配置
              expandIcon={this.expandIcon}
              expandedRowRender={i => (
                <RequireListDetail
                  orderList={i.orders}
                  nowCareer={i}
                  id={i.engineer_id}
                  careerId={i.id}
                  onSuccess={this.getList}
                />
              )}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PeopleManagement;

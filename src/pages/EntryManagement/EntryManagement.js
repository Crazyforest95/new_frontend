import React, { PureComponent } from 'react';
import { connect } from 'dva';
import get from 'lodash/get';
import { Form, Card, Table, Steps, Icon, Row, Col, Modal, Divider, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { rejectInto, confirmEntryMessage, materialsApprove } from '@/services/enterProjects';
import DropdownMenu from '@/components/DropdownMenu';
import CreateOrder from './CreateOrder';

import HeaderUpload from './component/HeaderUpload';
import Detail from './Detail';
import Resume from './Resume';
import ResumeDetails from './ResumeDetails';
import Reject from './Reject';
import OrderDetail from './OrderDetail';
import styles from './style.less';

const { Step } = Steps;

const gender = {
  0: '女',
  1: '男',
};

const useHrService = {
  true: '平台招聘',
  false: '自主招聘',
};

const entryStatus = {
  new: '平台发送入项申请中',
  engineer_agree: '项目经理确认入项信息中',
  pm_agree: '确认入项信息中',
  file_submit: '平台确认入项材料',
  file_om_agree: '项目经理确认入项材料',
  file_pm_agree: '确认入项材料',
  interview_pass_count: '平台发送入项申请中',
  new_count: '项目经理确认入项信息中',
  pm_agree_count: '确认入项信息中',
  purchase_agree_count: '人员提交入项材料中',
  file_submit_count: '平台确认入项材料中',
  file_om_count: '项目经理确认入项材料中',
  file_pm_count: '确认入项材料中',
  file_company_agree: '平台确认人员入项中',
  file_company_reject: '人员提交入项材料中',
  file_om_reject: '人员提交入项材料中',
  file_pm_reject: '人员提交入项材料中',
  purchase_agree: '人员提交材料中',
};

@connect(({ enterProjects, menu, loading }) => ({
  list: enterProjects.list,
  statistic: enterProjects.statistic,
  companyId: menu.companyId,
  loading: loading.effects['enterProjects/getList'], // 是否加载loading
}))
@Form.create()
class RequireDetailList extends PureComponent {
  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 10,
  };

  componentDidMount() {
    const {
      location: { query },
    } = this.props;
    this.getList(query);
  }

  // 获取列表
  getList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'enterProjects/getList',
      payload: {
        ...this.state,
        sort_id: -1,
        ing: 1,
        ...params,
      },
    });
    // 获取统计详情
    dispatch({
      type: 'enterProjects/statistic',
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

  cancel = id => {
    Modal.confirm({
      // title: 'This is an error message',
      content: '确定取消入项吗？',
      onOk: () => this.reject(id),
      okText: '确定',
      cancelText: '取消',
    });
  };

  confirm = (id, schema) => {
    Modal.confirm({
      // title: 'This is an error message',
      content: '确定入项信息',
      onOk: () => this.isConfirmEntry(id, schema),
      okText: '确定',
      cancelText: '取消',
    });
  };

  reject = id => {
    const params = { id, schema: 'EnterProjectRejectSchema' };
    rejectInto(params).then(res => {
      if (res) {
        message.success('拒绝成功');
        this.getList();
      } else {
        message.error('错误');
      }
    });
  };

  isConfirmEntry = (id, schema) => {
    const params = { id, schema };
    confirmEntryMessage(params).then(res => {
      if (res) {
        message.success('修改成功');
        this.getList();
      } else {
        message.error('错误');
      }
    });
  };

  // eslint-disable-next-line
  materialsIsOk = ({ id, yes_or_no, comment = '' }) => {
    const params = {
      engineer_id: id,
      schema: 'EnterProjectCompanyFileAuditSchema',
      yes_or_no,
      comment,
    };
    materialsApprove(params).then(res => {
      if (res) {
        message.success('操作成功');
        this.getList();
      } else {
        message.error('错误');
      }
    });
  };

  // eslint-disable-next-line
  omCheckFile = (id, yes_or_no) => {
    const params = { id, yes_or_no };
    Modal.confirm({
      // title:'是否确认入项该人员入项？',
      content: '确认通过入项材料？',
      onOk: () => this.materialsIsOk({ ...params }),
      okText: '确定',
      cancelText: '取消',
    });
  };

  render() {
    const { list, loading, statistic } = this.props;
    // const { selectedRowKeys } = this.state;
    const pagination = { pageSize: 10, total: list.page_info.total };

    const columns = [
      {
        title: '姓名',
        dataIndex: 'engineer.real_name',
        align: 'center',
      },
      {
        title: '性别',
        dataIndex: 'engineer.gender',
        render: sex => gender[sex],
        align: 'center',
      },
      {
        title: '招聘形式',
        dataIndex: 'use_hr_service',
        render: status => useHrService[status],
        align: 'center',
      },
      {
        title: '待入项目',
        dataIndex: 'project',
        align: 'center',
      },
      {
        title: '人员入项状态',
        dataIndex: 'status',
        align: 'center',
        render: status => {
          return entryStatus[status];
        },
      },
      {
        title: '下一步操作',
        dataIndex: 'status',
        key: 'nextStep',
        align: 'center',
        render: (status, detail) => {
          if (status === 'file_pm_agree') {
            return (
              <>
                <ResumeDetails id={detail.engineer.id} />
                <Divider type="vertical" />
                <CreateOrder
                  text="确认"
                  title="创建采购订单"
                  id={detail.id}
                  onSuccess={this.getList}
                />
                <Divider type="vertical" />
                <Reject onClick={this.materialsIsOk} id={detail.engineer.id} />
              </>
            );
          }
          if (status === 'pm_agree') {
            return (
              <>
                <Detail detail={detail} title={<a>入项信息</a>} />
                <Divider type="vertical" />
                <a onClick={() => this.confirm(detail.id, 'EnterProjectCheckSchema')}>通过</a>
                <Divider type="vertical" />
                <a onClick={() => this.confirm(detail.id, 'EnterProjectRejectSchema')}>驳回</a>
              </>
            );
          }
          return '无';
        },
      },
      {
        title: '',
        align: 'center',
        render: (item, all) => {
          const menuList = [
            
            <Resume detail={get(item, 'engineer.cv_path', [])} />,
          ];
          const addDetail = all.status === "purchase_agree" || all.status === "file_submit" || all.status === "file_om_agree" || all.status ==="file_pm_agree";
          if(addDetail) {
            menuList.push(
              <Detail detail={item} title="入项信息" />,
            );
          }

          if(all.status === "file_company_agree") {
            menuList.push(
              <Detail detail={item} title="入项信息" />,
              <ResumeDetails id={item.engineer.id} />,
              <OrderDetail engineerId={item.engineer.id} />
            );
          }

          if (all.status === 'file_pm_count') {
            menuList.push(
              <ResumeDetails id={item.engineer.id} />,
              <Detail detail={item} title="入项信息" />,
            );
          }
          if (all.status === 'file_company_agree_count') {
            menuList.push(<OrderDetail engineerId={item.engineer.id} />);
          }

          return <DropdownMenu menuList={menuList} />;
        },
      },
    ];

    return (
      <PageHeaderWrapper hiddenBreadcrumb>
        <Card className={styles.header}>
          <HeaderUpload />
        </Card>
        <Card bordered={false}>
          <div>
            <Row align="middle" justify="center">
              <Col span={24}>
                <Steps current={9} labelPlacement="vertical">
                  <Step
                    title={<span>平台发送入项申请中</span>}
                    description={String(statistic.entry_agree_count|| 0)}
                    icon={<Icon type="right-circle" />}
                  />
                  <Step
                    title="项目经理确认入项信息中"
                    description={String(statistic.engineer_agree_count || 0)}
                    icon={<Icon type="right-circle" />}
                  />
                  <Step
                    title="确认入项信息中"
                    description={String(statistic.pm_agree_count || 0)}
                    icon={<Icon type="right-circle" />}
                  />
                  {/* 新添加未添加数据 */}
                  <Step
                    title="人员提交入项材料中"
                    description={String(statistic.purchase_agree_count || 0)}
                    icon={<Icon type="right-circle" />}
                  />
                  <Step
                    title="平台确认入项材料中"
                    description={String(statistic.file_submit_count || 0)}
                    icon={<Icon type="right-circle" />}
                  />
                  <Step
                    title="项目经理确认入项材料中"
                    description={String(statistic.file_om_count || 0)}
                    icon={<Icon type="right-circle" />}
                  />
                  <Step
                    title="确认入项材料中"
                    description={String(statistic.file_pm_count || 0)}
                    icon={<Icon type="right-circle" />}
                  />
                  {/* 新添加未添加数据 */}
                  <Step
                    title="平台确认人员入项中"
                    description={String(statistic.file_company_agree_count || 0)}
                    icon={<Icon type="right-circle" />}
                  />
                </Steps>
                <div className={styles.detailCard}>
                  <Table
                    loading={loading}
                    // rowSelection={rowSelection}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={list.data}
                    onChange={this.handleChange} // 点击分页回掉事件
                    pagination={{ ...pagination }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RequireDetailList;

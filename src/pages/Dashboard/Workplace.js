import React, { PureComponent } from 'react';
import moment from 'moment';
import Link from 'umi/link'; // eslint-disable-line
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Card, Collapse, Button, Divider, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StepCard from './component/StepCard';
import Add from '../PeopleManagement/Add';

import styles from './Workplace.less';

const { Panel } = Collapse;

@connect(({ company, loading }) => ({
  detail: company.detail,
  loading: loading.effects['company/getDetail'],
}))
class Workplace extends PureComponent {
  state = {
    page: 1,
    per_page: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/getDetail',
      payload: {
        schema: 'CompanySimpleStatisticSchema',
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  // 点击管理跳转
  toDetail = (url, params, warning = true) => {
    if (warning) {
      message.warning('暂无相关数据');
      return;
    }
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: url,
        query: { ...params },
      })
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

  render() {
    /*eslint-disable*/
    const {
      loading,
      detail: {
        enter_project_statistic: { pm_agree, file_pm_agree = 0, file_pm_count = 0 } = {}, // todo 后期确认接口参数是否正确
        payment_statistic: { un_checked } = {},
        open_offers_count,
        engineer_statistic: { total, leaving_count, leave_count, on_duty_count } = {},
        order_statistic: { ending_count } = {},
      },
    } = this.props;

    const pageHeaderContent = (
      <div className={styles.date}>
        {moment(new Date(), 'YYYYMM').format('YYYY年MM月DD日  星期dd')}
      </div>
    );

    return (
      <PageHeaderWrapper loading={loading} content={pageHeaderContent} hiddenBreadcrumb>
        <Row gutter={24}>
          <Col span={12}>
            <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              loading={loading}
              bodyStyle={{ padding: 0 }}
            >
              <div className={styles.extraContent}>
                <div
                  className={styles.statItem}
                  onClick={() =>
                    this.toDetail('/entryManagement', { status: 'pm_agree' }, pm_agree === 0)
                  }
                >
                  <p>{pm_agree || 0}</p>
                  <p>等待确认入项信息</p>
                </div>
                <div
                  className={styles.statItem}
                  onClick={() =>
                    this.toDetail('/entryManagement', { status: 'pm_agree' }, pm_agree === 0)
                  }
                >
                  <p>{file_pm_count || 0}</p>
                  <p>等待确认入项材料</p>
                </div>
                <div
                  className={styles.statItem}
                  onClick={() =>
                    this.toDetail(
                      '/peopleManagement',
                      { s_need_renew_order: 1 },
                      ending_count === 0
                    )
                  }
                >
                  <p>{ending_count || 0}</p>
                  <p>等待续签采购订单</p>
                </div>
                <div
                  className={styles.statItem}
                  onClick={() => this.toDetail('/paymentManagement/unpaid', {}, un_checked === 0)}
                >
                  <p>{un_checked || 0}</p>
                  <p>等待确认结算</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              loading={loading}
              bodyStyle={{ padding: 0 }}
            >
              <div className={styles.extraContent}>
                <div
                  className={styles.statItem}
                  onClick={() =>
                    this.toDetail('/requirementManagement', {}, open_offers_count === 0)
                  }
                >
                  <p>{open_offers_count || 0}</p>
                  <p>进行中的需求</p>
                </div>
                <div
                  className={styles.statItem}
                  onClick={() =>
                    this.toDetail('/peopleManagement', { status: 'on_duty' }, total === 0)
                  }
                >
                  <p>{on_duty_count || 0}</p>
                  <p>在项人员</p>
                </div>
                <div
                  className={styles.statItem}
                  onClick={() =>
                    this.toDetail('/peopleManagement', { status: 'leaving' }, leaving_count === 0)
                  }
                >
                  <p>{leaving_count || 0}</p>
                  <p>待出项人员</p>
                </div>
                <div
                  className={styles.statItem}
                  onClick={() =>
                    this.toDetail('/peopleManagement', { status: 'finish' }, leave_count === 0)
                  }
                >
                  <p>{leave_count || 0}</p>
                  <p>出项人员</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <div className={styles.useHelp}>使用帮助</div>
        <Collapse expandIconPosition="right">
          <Panel header="自主增员全流程">
            <Row gutter={24}>
              <Col span={6}>
                <StepCard
                  title="设置价格单"
                  content="现有按日和按月两种计费方式供选择。给职位设置不同级别所对应的单价即可。"
                  action={
                    <Link to="/basicInformation">
                      <Button type="primary">点击设置价格单</Button>
                    </Link>
                  }
                  step={1}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="创建工作人员账号"
                  content="现有项目经理及采购两种职位。为职位创建账号，即可拥有该职位的所有权限。"
                  action={
                    <Link to="/accountManagement">
                      <Button type="primary">点击创建工作人员账号</Button>
                    </Link>
                  }
                  step={2}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="创建项目，匹配项目经理"
                  content="创建项目，并设置该项目的项目经理作为负责人处理该项目的相关事宜。"
                  action={
                    <Link to="/projectManager">
                      <Button type="primary">点击创建项目</Button>
                    </Link>
                  }
                  step={3}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="设置入项材料要求"
                  content="设置人员入项需提交的入项材料要求，人员根据入项材料要求提交相应入项材料。"
                  action={
                    <Link to="/entryManagement">
                      <Button type="primary">点击设置入项材料要求</Button>
                    </Link>
                  }
                  step={4}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={6}>
                <StepCard
                  title="增员"
                  content="为人员创建账号并录入入项信息。"
                  action={<Add />}
                  step={5}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="平台初审人员入项材料"
                  content="人员提交入项材料后，首先由平台端进行初审，初审合格即可交由项目经理进行二审。"
                  step={6}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="项目经理二审人员入项材料"
                  content="平台初审合格的人员入项材料交由项目经理进行二审，二审合格即可交由采购进行终审。"
                  step={7}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="采购人员终审人员入项材料"
                  content="项目经理二审合格的人员入项材料交友采购人员进行终审，二审合格即可为人员创建采购订单。"
                  action={
                    <Link to="/entryManagement">
                      <Button type="primary">点击查看待审批入项材料人员</Button>
                    </Link>
                  }
                  step={8}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={6}>
                <StepCard
                  title="为人员创建采购订单"
                  content="为人员创建采购订单，交由平台完成人员入项相关事宜。"
                  step={9}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="等待人员入项"
                  content="平台进行人员入项相关事宜，人员入项会收到相关提醒。"
                  step={10}
                />
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <div style={{ marginTop: 20 }} />
        <Collapse expandIconPosition="right">
          <Panel header="平台招聘全流程">
            <Row gutter={24}>
              <Col span={6}>
                <StepCard
                  title="设置价格单"
                  content="现有按日和按月两种计费方式供选择。给职位设置不同级别所对应的单价即可。"
                  action={
                    <Link to="/basicInformation">
                      <Button type="primary">点击设置价格单</Button>
                    </Link>
                  }
                  step={1}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="创建工作人员账号"
                  content="现有项目经理及采购两种职位。为职位创建账号，即可拥有该职位的所有权限。"
                  action={
                    <Link to="/accountManagement">
                      <Button type="primary">点击创建工作人员账号</Button>
                    </Link>
                  }
                  step={2}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="创建项目，匹配项目经理"
                  content="创建项目，并设置该项目的项目经理作为负责人处理该项目的相关事宜。"
                  action={
                    <Link to="/projectManager">
                      <Button type="primary">点击创建项目</Button>
                    </Link>
                  }
                  step={3}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="设置入项材料要求"
                  content="设置人员入项需提交的入项材料要求，人员根据入项材料要求提交相应入项材料。"
                  action={
                    <Link to="/entryManagement">
                      <Button type="primary">点击设置入项材料要求</Button>
                    </Link>
                  }
                  step={4}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={6}>
                <StepCard
                  title="创建需求，等待平台响应"
                  content="创建需求，设置好相关参数，写清需求详情，即可等待平台响应需求。"
                  action={
                    <Link to="/requirementManagement">
                      <Button type="primary">点击创建需求</Button>
                    </Link>
                  }
                  step={5}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="项目经理登录账号"
                  content="进入微信公众号【牛咖外包管理平台】的项目经理入口，登录项目经理账号。登录后请及时修改密码。"
                  step={6}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="项目经理筛选简历"
                  content="在简历模块中筛选平台提供的简历，看到心仪的简历就可点击约面试，设置好简历可面试时间后，等待平台联系人员进行面试。"
                  step={7}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="项目经理评定面试结果"
                  content="面试后，项目经理可设置面试结果，当评定面试结果通过时，给面试人评定级别，并在备注中给出建议入项时间，等待平台联系工程师确认。"
                  step={8}
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={6}>
                <StepCard
                  title="确认入项申请"
                  content="采购人员二次审批人员入项信息。"
                  step={9}
                  action={
                    <Link to="/entryManagement">
                      <Button type="primary">点击确认入项信息</Button>
                    </Link>
                  }
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="平台初审人员入项材料"
                  content="人员提交入项材料后，首先由平台进行初审，初审合格即可交由项目经理进行二审。"
                  step={10}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="项目经理二审人员入项材料"
                  content="平台初审合格的人员入项材料交由项目经理进行二审，二审合格即可交由采购进行终审。"
                  step={11}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="采购人员终审人员入项材料"
                  content="项目经理二审合格的人员入项材料交由采购人员进行终审，二审合格即可为人员创建采购订单。"
                  step={12}
                  action={
                    <Link to="/entryManagement">
                      <Button type="primary">点击查看待审批入项材料人员</Button>
                    </Link>
                  }
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <StepCard
                  title="为人员创建采购订单"
                  content="为人员创建采购订单，交由平台完成人员入项相关事宜。"
                  step={13}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="等待人员入项"
                  content="平台进行人员入项相关事宜，人员入项后会收到相关提醒。"
                  step={14}
                />
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <div style={{ marginTop: 20 }} />
        <Collapse expandIconPosition="right">
          <Panel header="工时结算全流程">
            <Row gutter={24}>
              <Col span={6}>
                <StepCard
                  title="人员登录账号"
                  content="进入微信公众号【牛咖外包管理平台】的工程师入口，登录账号。登录后请及时修改密码。"
                  step={1}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="填写日报并提交工时报告"
                  content="每日按照实际工作情况填写日报。日报应在下月月初提交给项目经理审批。如遇特殊情况，请提前申请请假、加班申请，项目经理审批。"
                  step={2}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="平台汇总工时，发送结算单"
                  content="平台汇总工时，并发送结算单供审批（1或3个月到账期均每月发送结算单供审批）。"
                  step={3}
                />
              </Col>
              <Col span={6}>
                <StepCard
                  title="确认付款单"
                  content="收到经经项目经理审批工时确认的付款单，同意付款即可点击【确认付款】按钮。"
                  action={
                    <Link to="/paymentManagement/unpaid">
                      <Button type="primary">点击查看待付款项</Button>
                    </Link>
                  }
                  step={4}
                />
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;

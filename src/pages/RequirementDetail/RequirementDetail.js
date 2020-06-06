import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Divider, Button, Modal, message, Typography, Row, Col, Table, Dropdown, Menu, DatePicker } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';
import { ResumeCollectionBarChart } from '@/components/Charts';
import Detail from './Detail';
import Resumes from './Resumes';
import HierachicalChart from './HierachicalPieChart';
import EditRequirementModal from './EditRequirementModal';
import CloseRequirementModal from './CloseRequirementModal';
import CompareResumesModal from './CompareResumesModal';
import CountTracks from './CountTracks';


import classes from './RequirementDetail.less';

const MonitoringTable = React.lazy(() => import('./MonitoringTable'))

const { Title, Text } = Typography;

const styles = {
  cardHeadStyle: {
    backgroundColor: '#2979FF',
    color: '#fafafa',
    fontWeight: 'bold',
    fontSize: 20
  },
  subCardHeadStyle: {
    backgroundColor: '#2979FF',
    color: '#fafafa',
    fontSize: 15
  }
}

const status = {
  open: '进行中',
  closed: '已关闭',
};

@connect(({ requirementManagement, menu, loading, interview }) => ({
  list: requirementManagement.list.data,
  companyId: menu.companyId,
  detail: interview.detail,
  loading: loading.effects['interview/getDetail'],

  // cobra-55555 -20-04-17 !!! important
  project_detail: requirementManagement.project_detail,  // detail of the offer
  offer_data_list: requirementManagement.offer_data_list, // resumes of the offer
  count_tracks: requirementManagement.count_tracks,  // count tracks
  dailyTotalDataRe: requirementManagement.dailyTotalDataRe,
  dailyTotalDataWp: requirementManagement.dailyTotalDataWp,
  dailyTotalDataIp: requirementManagement.dailyTotalDataIp,
  dailyTotalDataOp: requirementManagement.dailyTotalDataOp,
  dailyPerDataRe: requirementManagement.dailyPerDataRe,
  dailyPerDataWp: requirementManagement.dailyPerDataWp,
  dailyPerDataIp: requirementManagement.dailyPerDataIp,
  dailyPerDataOp: requirementManagement.dailyPerDataOp,
  interviewTableData: requirementManagement.interviewTableData,
  todayDate: requirementManagement.todayDate,
  interNum: requirementManagement.interNum,
}))
class RequirementDetail extends Component {

  state = {
    showChartBtn: false,
    logs: [],
    writtenTableData: [],
    writtenOnlineDeveloper: 3,
    writtenTotalDeveloper: 100,
    interviewOnlineDeveloper: 3,
    interviewTotalDeveloper: 100,
    selectedResumes: [],
    activeCountedTrackSection: 0, // display resume collection --1, written pass num --2, interview pass num --3, offer pass num --4 
  }

  async componentWillMount() {
    this.getProjects();
    let data = [];
    for (let i = 0; i < 100; i++) {
      let rowData = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < 3) {
          rowData.push({
            online: true,
            name: "小明"
          })
        } else {
          rowData.push({
            online: false,
            name: "小明"
          })
        }
      }
      data.push(rowData);
    }
    this.setState({ writtenTableData: data });
    this.getLogs(this.props.todayDate);
  }

  // cobra-55555 -20-04-17
  getProjects = () => {
    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split("/");
    const id = array[array.length - 1];
    const { dispatch } = this.props;

    dispatch({
      type: 'requirementManagement/getDetail',
      payload: {
        id,
        schema: 'OfferDetailSchema',
      },
    });
  };


  // // // // //

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
          window.history.back();
        } else {
          message.error('错误');
        }
      },
    });
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

  warning = () => {
    Modal.confirm({
      // title: 'This is a warning message',
      content: '确定关闭需求吗？',
      onOk: () => console.log('告警'),
      okText: '确定',
      cancelText: '取消',
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
        this.getProjects();
      },
    });
  };

  entryTime = (date, item) => {
    const { dispatch } = this.props;
    const sendData = {
      date,
      schema: 'InterviewEntryPutSchema',
      id: item.id,
    };
    dispatch({
      type: 'interview/entryTime',
      payload: {
        ...sendData,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
        } else {
          message.error('错误');
        }
        this.getProjects();
      },
    });
  };

  // 点击管理跳转
  goBack = () => {
    window.history.back();
  };

  disabledDate = current => {
    return current && current < moment().endOf('day');
  };

  // 待约，取消
  cancelRequirement = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interview/update',
      payload: {
        schema: 'InterviewStatusPutSchema',
        status: 'reject_by_engineer',
        id,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
        } else {
          message.error('错误');
        }
        this.getProjects();
      },
    });
  };

  // 淘汰，删除
  deleteRequirement = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interview/delete',
      payload: {
        id,
      },
      callback: datas => {
        if (datas) {

          message.success('删除成功');
        } else {
          message.error('错误');
        }
        this.getProjects();
      },
    });
  };

  getLogs = date => {
    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split("/");
    const id = array[array.length - 1];

    var date1 = '';
    if (typeof date === 'undefined')
      date1 = 'today';
    else
      date1 = date;

    const { dispatch } = this.props;
    dispatch({
      type: 'requirementManagement/getDetailLog',
      payload: {
        id,
        date: date1,
        schema: 'OfferLogsSchema',
      },
      callback: datas => {
        if (datas) {
          this.setState({ logs: datas.data }, this.render);
        } else {
          message.error('错误');
        }
      },
    });
  }
  // // // // //

  // customize
  resumeCheckHandle = (resumeId, status) => {
    let idx = this.state.selectedResumes.findIndex(resume => resume.id === resumeId);
    let selectedResumes = this.state.selectedResumes.map(resume => resume);
    if ((idx === -1) && status) {
      selectedResumes.push({
        id: resumeId
      });
    } else if (idx !== -1 && !status) {
      selectedResumes.splice(idx, 1);
    }
    this.setState({
      selectedResumes: selectedResumes
    });
  }

  actionChartBtn = () => {
    this.setState((state) => {
      return {
        showChartBtn: !state.showChartBtn
      }
    });
  }

  toRequirementReport = () => {
    const { offer_data_list } = this.props;
    if (offer_data_list.length < 1) {
      return;
    }

    const { dispatch, match: { params: { id } } } = this.props;
    dispatch(routerRedux.push(`../requirementReport/${id}`));
  }

  changeCountTrackSection = (idx) => {
    this.setState({
      activeCountedTrackSection: idx
    });
  }

  onChangeDate = (e) => {
    if (e == null) {
      this.getLogs('');
    }
    else {
      this.getLogs(e.format('YYYY-MM-DD'));
    }
  }

  renderPerChatSwitch = (param) => {
    var result = [];
    switch (param) {
      case 0:
        result = this.props.dailyPerDataRe;
        break;
      case 1:
        result = this.props.dailyPerDataWp;
        break;
      case 2:
        result = this.props.dailyPerDataIp;
        break;
      case 3:
        result = this.props.dailyPerDataOp;

      default:
        break;
    }
    return result;
  }

  // render per chat index to data list
  renderTotalChatSwitch = (param) => {
    var result = [];
    switch (param) {
      case 0:
        result = this.props.dailyTotalDataRe;
        break;
      case 1:
        result = this.props.dailyTotalDataWp;
        break;
      case 2:
        result = this.props.dailyTotalDataIp;
        break;
      case 3:
        result = this.props.dailyTotalDataOp;

      default:
        break;
    }
    return result;
  }
  // // // // //

  render() {
    const { list, detail, loading } = this.props;

    // console.log('props: ', this.props)

    // cobra-55555 -20-04-17
    const { project_detail } = this.props;
    const { offer_data_list } = this.props;
    const { count_tracks } = this.props;

    const { interviewTableData } = this.props;
    const { interNum } = this.props;
    const { todayDate } = this.props;

    const urlParams = new URL(window.location.href);
    const path = urlParams.pathname;
    const array = path.split("/");
    const id = array[array.length - 1];
    // // // // //

    const {
      showChartBtn,
      writtenTableData,
      writtenOnlineDeveloper,
      writtenTotalDeveloper,
      interviewOnlineDeveloper,
      interviewTotalDeveloper,
      selectedResumes,
      activeCountedTrackSection   // chat item (resume collection, written pass num, ...)
    } = this.state;
    const {
      cv_new = [],
      cv_pass = [],
      entry = [],
      interview_new = [],
      interview_pass = [],
      reject = [],
    } = detail;
    const title = (
      <div>
        <Button icon="left" onClick={this.goBack}>
          返回
        </Button>
        <div style={{ marginTop: '12px', fontSize: 14, color: '#2979FF' }}><a href="/requirementManagement">需求列表</a> / <span style={{ color: 'black' }}>需求详情</span></div>
      </div>
    );

    if (typeof project_detail === 'undefined' || typeof offer_data_list === 'undefined') {
      return (<div></div>);
    }

    return (
      <PageHeaderWrapper title={title} loading={loading} hiddenBreadcrumb>
        <Card title="基本信息"
          headStyle={styles.cardHeadStyle}
          bodyStyle={{ paddingLeft: 30, paddingRight: 30 }}
          size="small"
          className={classes.mB20}
          extra={<div>
            <EditRequirementModal data={project_detail} />
            <CloseRequirementModal id={id} />
          </div>}
        >
          <Detail detail={project_detail} />
        </Card>
        <Card title="推荐简历"
          headStyle={styles.cardHeadStyle}
          size="small"
          className={classes.mB20}
          extra={<Button size="small" onClick={() => this.toRequirementReport()}>更多简历</Button>}
        >
          <div style={{ marginBottom: '10px' }}>
            <Resumes lists={offer_data_list} resumeCheckHandle={this.resumeCheckHandle} selectedResumes={selectedResumes} />
          </div>
          <Row>
            <Col offset={8} md={8}>
              <CompareResumesModal activedResumeNums={selectedResumes.length} selectedResumes={selectedResumes} resumes={offer_data_list} />
            </Col>
          </Row>
        </Card>
        <Card title="实时进度追踪"
          headStyle={styles.cardHeadStyle}
          className={classes.mB20}
          size="small">
          <Row gutter={16}>
            <Col md={10}>
              <CountTracks count_tracks={count_tracks} changeCountTrackSection={this.changeCountTrackSection} />
              <Card style={{
                border: '2px solid #2979ff',
                marginTop: 12,
                marginBottom: 20
              }} size="samll">
                <div style={{
                  position: 'absolute',
                  display: 'block',
                  width: 20,
                  height: 20,
                  left: (activeCountedTrackSection * 2 + 1) / 8 * 100 + '%',
                  top: -11,
                  background: '#fafafa',
                  borderLeft: '2px solid #2979ff',
                  borderTop: '2px solid #2979ff',
                  transform: 'rotate(45deg)'
                }}></div>
                <AsyncLoadBizCharts>
                  <></>
                  {showChartBtn ?
                    <ResumeCollectionBarChart
                      title="每日收集简历数"
                      data={this.renderPerChatSwitch(activeCountedTrackSection)}
                      height={340}
                      btnTxt="查看累积统计"
                      actionBtn={this.actionChartBtn}
                    /> :
                    <ResumeCollectionBarChart
                      title="累计收集简历数"
                      data={this.renderTotalChatSwitch(activeCountedTrackSection)}
                      height={340}
                      btnTxt="查看日统计"
                      actionBtn={this.actionChartBtn}
                    />
                  }
                </AsyncLoadBizCharts>
              </Card>
              <HierachicalChart
                title="全流程招聘图示"
                count_tracks={count_tracks}
              />
            </Col>
            <Col md={14}>
              <Card className={[classes.mB20, classes.borderBlue]}
                size="small"
                title={<Title level={4}>{todayDate} 招聘进展跟踪</Title>}
                extra={<DatePicker defaultValue={moment(todayDate, 'YYYY-MM-DD')}
                  // dateFormat="YYYY-MM-DD"
                  onChange={(date) => this.onChangeDate(date)} />}
              >
                <div style={{ overflowY: 'auto', maxHeight: 350 }}>
                  {this.state.logs.map((log, idx) => (<p key={idx} className={classes.mB8}>{log}</p>))}
                </div>
              </Card>
              <React.Suspense fallback={null}>
                <MonitoringTable
                  title="人员笔试监控"
                  tableData={interviewTableData}
                  numData={interNum}
                />
                <MonitoringTable
                  title="人员面试监控"
                  tableData={interviewTableData}
                  numData={interNum}
                />
              </React.Suspense>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RequirementDetail;

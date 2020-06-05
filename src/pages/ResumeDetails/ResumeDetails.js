import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Upload, Modal, BackTop, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import API from '@/api';
import { guid } from '@/utils/utils';
import WorkReport from './WorkReport';
import Payment from './Payment';
import InterviewTable from './InterviewTable';
import Careers from './Careers';
import UpdatePersonalInformation from './UpdatePersonalInformation';
import Resignation from './Resignation';
// import MoveItems from './MoveItems';
import ChangePassword from './ChangePassword';
import APP_CONFIG from '@/config';
import styles from './ResumeDetails.less';
import { getToken } from '../../utils/authority';

const { Description } = DescriptionList;
// const { MonthPicker } = DatePicker;

const educationExperienceColumns = [
  {
    title: '开始时间',
    dataIndex: 'start_date',
    key: 'start_date',
  },
  {
    title: '结束时间',
    dataIndex: 'end_date',
    key: 'end_date',
  },
  {
    title: '毕业院校',
    dataIndex: 'school',
    key: 'school',
  },
  {
    title: '专业',
    dataIndex: 'major',
    key: 'major',
  },
  {
    title: '学历',
    dataIndex: 'degree',
    key: 'degree',
  },
];
const status = {
  ready: '待选',
  interview: '面试中',
  on_duty: '在职',
};
const jobWantedStatus = {
  positive: '积极找工作',
  negative: '暂时不换工作',
  neutral: '随便看看',
};

@connect(({ engineer, loading }) => ({
  detail: engineer.detail,
  loading: loading.effects['engineer/getDetail'],
}))
class ResumeDetails extends Component {
  state = {
    fileList: [],
  };

  componentWillMount() {
    this.detail();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'engineer/saveDetail',
      payload: { now_career: { offer: { pm: {} } } },
    });
  }

  detail = () => {
    const urlParams = new URL(window.location.href);
    const id = urlParams.searchParams.get('id');
    const { dispatch } = this.props;
    dispatch({
      type: 'engineer/getDetail',
      payload: {
        schema: 'EngineerDetailSchema',
        id,
      },
    });
  };

  delete = id => {
    Modal.confirm({
      // title: 'This is an error message',
      content: '确定删除吗？',
      onOk: () => this.deleteResume(id),
      okText: '确定',
      cancelText: '取消',
    });
  };

  goBack = () => {
    window.history.back();
  };

  // 修改
  update = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'engineer/update',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas) {
          message.success('修改成功');
        } else {
          message.error('错误');
        }
        this.detail();
      },
    });
  };

  // 离职
  resignation = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'engineer/resignation',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
        } else {
          message.error('错误');
        }
        this.detail();
      },
    });
  };

  // 删除简历
  deleteResume = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'engineer/delete',
      payload: {
        id,
      },
      callback: datas => {
        if (datas) {
          message.success('删除成功');
          this.goBack();
        } else {
          message.error('错误');
        }
      },
    });
  };

  // 修改简历
  updateResume = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'engineer/updateResume',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas) {
          message.success('修改成功');
        } else {
          message.error('错误');
        }
        this.detail();
        this.setState({
          fileList: [],
        });
      },
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

  render() {
    const { detail, loading } = this.props;
    const { fileList } = this.state;
    /* eslint-disable */ const {
      abilities = [],
      education = [],
      now_career,
      cv_path = [],
      id,
    } = detail;
    const { offer_sheet = {}, offer = { pm: {} } } = now_career || { offer: { pm: {} } };
    const { pm = {} } = offer;
    /* eslint-enable */
    const token = getToken();

    const props = {
      action: `${APP_CONFIG.APP_HOST}${API.upload.contract}`,
      accept: '.pdf,.doc,.docx',
      headers: {
        Authorization: `Bearer ${token || ''}`,
        // Accept: 'application/json',
      },
      name: 'contract',
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
      },
      fileList,
      onChange: res => {
        if (res.fileList[0].response) {
          const param = {
            id,
            schema: 'EngineerUploadCvSchema',
            cv_upload_result: res.fileList[0].response,
          };
          this.updateResume(param);
        }
      },
    };

    const title = (
      <div>
        <div>
          <Button icon="left" onClick={this.goBack}>
            返回
          </Button>
        </div>
        <div className={styles.headerButton}>
          <div>简历详情</div>
          <div>
            <ChangePassword data={detail} changePassword={this.changePassword} />
            <span className={styles.space} />
            {detail.status === 'on_duty' && (
              <>
                <Resignation detail={detail} resignation={this.resignation} />
                <span className={styles.space} />
              </>
            )}
            {/* <MoveItems /> */}
            <Button type="primary" onClick={() => this.delete(id)}>
              删除
            </Button>
          </div>
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper hiddenBreadcrumb title={title} loading={loading}>
        <Card
          title="基本信息"
          bordered={false}
          extra={<UpdatePersonalInformation update={this.update} id={detail.id} />}
        >
          <DescriptionList col={4} size="large" style={{ marginBottom: 32 }}>
            <Description term="姓名">{detail.real_name}</Description>
            <Description term="性别">{detail.gender ? '男' : '女'}</Description>
            <Description term="求职状态">{jobWantedStatus[detail.job_wanted_status]}</Description>
            <Description term="职位">{offer.position}</Description>
            <Description term="级别">{offer.position_level}</Description>
            <Description term="单价">{offer_sheet.money}</Description>
            <Description term="合同确认">
              {detail.contract_confirm === 1 ? '已确认' : '未确认'}
            </Description>
            <Description term="银行账号">{detail.bank_code}</Description>
            <Description term="代缴福利">{detail.pay_welfare === 1 ? '是' : '否'}</Description>
            <Description term="系统账号">{detail.pre_username}</Description>
            <Description term="社保基数">{`${detail.welfare_rate || 0}`}</Description>
            <Description term="工作状态">{status[detail.status]}</Description>
            <Description term="电话">{detail.phone}</Description>
            <Description term="邮箱">{detail.email}</Description>
            <Description term="账号状态">{detail.activate === 1 ? '已开通' : '未开通'}</Description>
            <Description term="所属项目">{offer.project}</Description>
            <Description term="项目经理">{pm.real_name}</Description>
          </DescriptionList>
        </Card>
        <Card title="工作技能">
          {abilities.map(item => (
            <Card.Grid className={styles.main} key={item.name}>
              <div className={styles.skill}>
                <span className={styles.text}>技能名称</span>
                <span className={styles.value}>{item.name}</span>
              </div>
              <div className={styles.skill}>
                <span className={styles.text}>熟练程度</span>
                <span className={styles.value}>{item.level}</span>
              </div>
            </Card.Grid>
          ))}
        </Card>
        <Card title="教育背景" bordered={false}>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={education}
            rowKey={record => record.id}
            columns={educationExperienceColumns}
          />
        </Card>
        <InterviewTable />
        <Careers />
        <WorkReport />
        <Payment />
        <Card
          title="个人简历"
          bordered={false}
          extra={
            <>
              <Upload {...props} disabled={fileList.length >= 1}>
                <Button type="primary">上传新文件</Button>
              </Upload>
            </>
          }
        >
          {cv_path.map(item => {
            const date = guid();
            return (
              <div key={item}>
                <img
                  src={`${APP_CONFIG.APP_HOST.replace([/api/], '')}${item}?${date}`}
                  alt=""
                  style={{ width: '90%' }}
                />
              </div>
            );
          })}
        </Card>
        <BackTop />
      </PageHeaderWrapper>
    );
  }
}

export default ResumeDetails;

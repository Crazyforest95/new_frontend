import React from 'react';
import { routerRedux } from 'dva/router';
import { Modal, Icon, message } from 'antd';
import { connect } from 'dva/index';
import InterviewTimeSelector from './components/InterviewTimeSelector';
// import styles from './RequirementDetail.less';

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
class Daily extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dateData: props.freeTime.map(item => {
        return {
          ...item,
          am: item.am ? false : 'disable',
          pmA: item.pmA ? false : 'disable',
          pmB: item.pmB ? false : 'disable',
        };
      }),
      newDateData: null,
      sendDate: null,
    };
  }

  add = data => {
    const { dispatch, getProjects } = this.props;
    dispatch({
      type: 'interview/update',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
        } else {
          message.error(datas.error.message);
        }
        getProjects();
      },
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
      newDateData: null,
    });
  };

  handleOk = () => {
    const { sendDate } = this.state;
    const { id } = this.props;

    if (sendDate) {
      const sendData = {
        status: 'interview_new',
        appoint_time: sendDate,
        schema: 'InterviewStatusPutSchema',
        id,
      };
      this.add(sendData);
      this.setState({
        visible: false,
        newDateData: null,
      });
    } else {
      message.error('请选择时间');
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleDateChange = (date, time) => {
    const { dateData } = this.state;
    const idx = dateData.findIndex(item => item.date === date);
    const newDateData = [...dateData];
    if (idx !== -1) {
      newDateData[idx] = {
        ...newDateData[idx],
        [time]: !newDateData[idx][time],
      };
    }
    const sendDate = {
      am: false,
      date,
      disable: false,
      need_init: false,
      pmA: false,
      pmB: false,
    };
    sendDate[time] = true;
    this.setState({
      newDateData,
      sendDate,
    });
    console.log(sendDate);
  };

  handleConfirmCV = () => {
    this.setState({
      visible: false,
    });
  };

  toRequirementDetail = () => {
    const { dispatch } = this.props;
    const id = 1;
    dispatch(routerRedux.push(`/resumeDetails?id=${id}`));
  };

  render() {
    const { visible, dateData, newDateData } = this.state;
    const { them } = this.props;
    return (
      <span>
        <div onClick={this.showModal}>
          <Icon type="calendar" theme="filled" style={{ color: them }} />
        </div>
        <Modal
          title="面试时间"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
          destroyOnClose
          maskClosable={false}
        >
          <InterviewTimeSelector
            data={newDateData || dateData}
            onChange={this.handleDateChange}
            onConfirm={this.handleConfirmCV}
            // onCancel={() => {
            //   setState({
            //     ...state,
            //     dateModalVisible: false
            //   });
            // }}
          />
        </Modal>
      </span>
    );
  }
}

export default Daily;

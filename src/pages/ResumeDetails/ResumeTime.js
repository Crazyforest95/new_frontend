import React from 'react';
import { routerRedux } from 'dva/router';
import { Modal, Icon } from 'antd';
import { connect } from 'dva/index';
import TimeSelector from './components/CVTimeSelector';
// import styles from './RequirementDetail.less';

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
class Daily extends React.Component {
  state = {
    visible: false,
    dateData: [
      {
        am: true,
        date: '2019-03-07',
        disable: false,
        need_init: false,
        pmA: false,
        pmB: true,
      },
    ].map(item => {
      return {
        ...item,
        am: item.am ? false : 'disable',
        pmA: item.pmA ? false : 'disable',
        pmB: item.pmB ? false : 'disable',
      };
    }),
    newDateData: null,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    const { dateData, newDateData } = this.state;
    const { add } = this.props;

    let sendData = dateData;
    if (newDateData) {
      sendData = newDateData.map(item => ({
        ...item,
        am: !(item.am === 'disable' || !item.am),
        pmA: !(item.pmA === 'disable' || !item.pmA),
        pmB: !(item.pmB === 'disable' || !item.pmB),
      }));
    }
    add(sendData);
    this.setState({
      visible: false,
    });
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
    this.setState({
      newDateData,
    });
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
    return (
      <span>
        <div onClick={this.showModal}>
          <Icon type="calendar" theme="filled" />
        </div>
        <Modal
          title="推荐简历"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
          destroyOnClose
          maskClosable={false}
        >
          <TimeSelector
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

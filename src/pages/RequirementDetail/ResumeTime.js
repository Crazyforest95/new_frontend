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
    dateData: [],
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleDateChange = d => {
    const { dateData } = this.state;
    const idx = dateData.findIndex(item => item.date === d.date);
    const newDateData = [...dateData];
    if (idx !== -1) {
      newDateData[idx] = {
        ...newDateData[idx],
        am: d.am || false,
        pmA: d.pmA || false,
        pmB: d.pmB || false,
      };
    } else {
      newDateData.push(d);
    }
    this.setState({
      dateData: newDateData,
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
    const { visible, dateData } = this.state;

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
            data={dateData}
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

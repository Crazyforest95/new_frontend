import React from 'react';
// import { connect } from 'dva';
import { Modal, Row, Col } from 'antd';
import { connect } from 'dva/index';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';
import { Pie } from '@/components/Charts';
import styles from './style.less';

@connect(({ requirementManagement }) => ({
  list: requirementManagement.list,
}))
class Statistics extends React.Component {
  state = {
    visible: false,
    statistics: {},
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.details();
  };

  details = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'requirementManagement/statistics',
      payload: {
        id,
      },
      callback: statistics => {
        this.setState({
          statistics,
        });
      },
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

  render() {
    /* eslint-disable */
    const { visible, statistics } = this.state;
    const {
      cv_pass_amount,
      cv_push_amount,
      demand_amount,
      entry_amount,
      interview_pass_amount,
    } = statistics;
    const { id, title } = this.props;
    return (
      <span>
        <a type="primary" onClick={this.showModal.bind(this, id)}>
          统计
        </a>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          destroyOnClose
          footer={null}
        >
          <AsyncLoadBizCharts>
            <Row>
              <Col span={6}>
                <Pie
                  percent={this.rate(cv_push_amount, demand_amount)}
                  total={`${cv_push_amount}/${demand_amount}`}
                  height={140}
                />
                <div className={styles.statisticsText}>简历需求比</div>
              </Col>
              <Col span={6}>
                <Pie
                  percent={this.rate(cv_pass_amount, cv_push_amount)}
                  total={`${cv_pass_amount}/${cv_push_amount}`}
                  height={140}
                />
                <div className={styles.statisticsText}>简历通过率</div>
              </Col>
              <Col span={6}>
                <Pie
                  percent={this.rate(interview_pass_amount, cv_pass_amount)}
                  total={`${interview_pass_amount}/${cv_pass_amount}`}
                  height={140}
                />
                <div className={styles.statisticsText}>面试通过率</div>
              </Col>
              <Col span={6}>
                <Pie
                  percent={this.rate(entry_amount, demand_amount)}
                  total={`${entry_amount}/${demand_amount}`}
                  height={140}
                />
                <div className={styles.statisticsText}>综合需求满足率</div>
              </Col>
            </Row>
          </AsyncLoadBizCharts>
        </Modal>
      </span>
    );
    /* eslint-disable */
  }
}

export default Statistics;

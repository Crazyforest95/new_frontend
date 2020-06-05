import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, DatePicker, Icon, Tooltip, Button, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import styles from './RequirementDetail.less';
import InterviewTime from './InterviewTime';

const borderThem = {
  blue: '#0076FF',
  purple: '#DA7AEC',
  pink: '#FF4081',
  blueness: '#13c2c2',
  green: '#52C41A',
  orange: '#faad14',
  red: '#f5222d',
};

const selectTime = {
  am: '10~12点',
  pmA: '14~16点',
  pmB: '16~18点',
};

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
class ListCard extends Component {
  static propTypes = {
    // onSuccess: PropTypes.func, // 调用增加方法
    them: PropTypes.oneOf(['red', 'orange', 'blue', 'purple', 'pink', 'blueness', 'green']),
    time: PropTypes.objectOf({
      placeholder: PropTypes.string,
      onChange: PropTypes.func,
    }),
    detailsFunc: PropTypes.func,
    interviewTime: PropTypes.bool,
    details: PropTypes.objectOf({
      engineer: PropTypes.string,
      position: PropTypes.string,
    }),
    freeTime: PropTypes.array,
    getProjects: PropTypes.func,
    handle: PropTypes.func,
    status: PropTypes.string,
  };

  static defaultProps = {
    them: 'blue',
    time: '',
    detailsFunc: () => console.log('点击事件'),
    interviewTime: false,
    details: {},
    freeTime: [],
    getProjects: () => console.log('点击事件'),
    handle: () => console.log('点击事件'),
    status: '',
  };
  // componentDidMount() {
  //   const { dispatch, match } = this.props;
  //   const { params } = match;
  //
  //   dispatch({
  //     type: 'profile/fetchBasic',
  //     payload: params.id || '1000000000',
  //   });
  // }

  appointTime = date => {
    return (
      <span style={{ color: borderThem.pink }}>
        {`${date.date}     ${(date.am && selectTime.am) ||
          (date.pmA && selectTime.pmA) ||
          (date.pmB && selectTime.pmB) ||
          ''} `}
      </span>
    );
  };

  render() {
    const {
      them,
      time,
      detailsFunc,
      interviewTime,
      details,
      freeTime,
      getProjects,
      status,
      handle,
    } = this.props;

    return (
      <Card style={{ borderLeftColor: borderThem[them] }} className={styles.list}>
        <div className={styles.text}>
          <span className={styles.name}>{details.engineer}</span>
          <span>{details.position}</span>
          <span onClick={() => detailsFunc()}>
            <Icon type="file-text" theme="filled" />
          </span>
        </div>
        {time && (
          <>
            <div className={styles.interviewTime}>
              {status === 'interview_pass' ? (
                <>
                  <DatePicker {...time} style={{ width: '65%' }} />
                  <Popconfirm title="是否要拒绝？" onConfirm={() => handle()}>
                    <Button type="danger">拒绝</Button>
                  </Popconfirm>
                </>
              ) : (
                <DatePicker {...time} style={{ width: '100%' }} />
              )}
            </div>
          </>
        )}
        {interviewTime && (
          <div className={styles.interviewTime}>
            <span>
              {details.appoint_time.date
                ? this.appointTime(details.appoint_time)
                : '未选择面试时间'}
            </span>
            {getProjects && (
              <>
                <Popconfirm title="是否要取消？" onConfirm={() => handle()}>
                  <Button size="small" type="danger">
                    取消
                  </Button>
                </Popconfirm>
                <Tooltip placement="right" title="面试时间">
                  <InterviewTime
                    freeTime={freeTime}
                    id={details.id}
                    them={borderThem[them]}
                    getProjects={getProjects}
                  />
                </Tooltip>
              </>
            )}
          </div>
        )}
        {status === 'reject' && (
          <div className={styles.interviewTime}>
            <Popconfirm title="是否要删除？" onConfirm={() => handle()}>
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        )}
      </Card>
    );
  }
}

export default ListCard;

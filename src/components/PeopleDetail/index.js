import React, { Component } from 'react';
import { Modal, Form, Row, Col, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import round from 'lodash/round';

import 'moment/locale/zh-cn';
import styles from './index.less';

const { MonthPicker } = DatePicker;

moment.locale('zh-cn');

@connect(({ payment, loading, routing }) => ({
  detail: payment.detail,
  loading: loading.effects['payment/getDetail'],
  location: routing.location,
}))
@Form.create()
class PeopleDetail extends Component {
  state = {
    visible: false,
    disError: 0,
  };

  datePickerChange = date => {
    const { _d } = date;
    this.getDetail(_d);
  };

  showModal = e => {
    e.stopPropagation();
    this.setState({
      visible: true,
    });

    this.getDetail();
  };

  handleCancel = e => {
    e.stopPropagation();
    this.setState({
      visible: false,
    });
  };

  // 获取人员详情接口数据
  getDetail = date => {
    const { dispatch, id, year_month: yearMonth } = this.props;
    const payload = date
      ? { engineer_id: id, year_month: moment(date).format('YYYYMM') }
      : { engineer_id: id, year_month: yearMonth };

    dispatch({
      type: 'payment/getDetail',
      payload,
    });
  };

  render() {
    const { visible } = this.state;
    const {
      detail,
      year_month: yearMonth,
      location: { pathname },
    } = this.props;
    
    if (detail) {
      if(detail.debug) {
        const {disError} = this.state;
        if (disError === 0) {
          message.info('存在订单周期未覆盖的日期');
          this.setState({disError: 1});
        }
        return (<Button type="primary" block onClick={this.showModal}>人员详情</Button>);
      }
    }

    const dateFormat = 'YYYY/MM';
    const modalTitle = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className={styles.wrapTitle}>人员详情</span>
        {pathname === '/peopleManagement' ? (
          <MonthPicker
            format={dateFormat}
            defaultValue={moment(new Date(), dateFormat)}
            onChange={date => {
              this.datePickerChange(date);
            }}
          />
        ) : (
          <span>{yearMonth}</span>
        )}

        {detail && (detail.payment.status !== 'payed' && detail.payment.status !== 'checked') ? (
          <i style={{ color: 'red', fontStyle: 'normal' }}>(待确认结算)</i>
        ) : null}
      </div>
    );
    const width = document.body.clientWidth || document.documentElement.clientWidth;

    const { isRequirement } = this.props;

    return (
      <>
        { isRequirement!==true ? 
          <span>
            <span onClick={this.showModal} className={styles.linkTitle}>
              人员详情
            </span>
          </span> 
          : 
          <Button type="primary" block onClick={this.showModal}>人员详情</Button>
        }
        
        <Modal
          title={modalTitle}
          visible={visible}
          width={width * 0.7}
          destroyOnClose
          maskClosable={false}
          onCancel={this.handleCancel}
          footer={
            <Button onClick={this.handleCancel} type="primary">
              确定
            </Button>
          }
        >
          {detail ? (
            <Form>
              <div className={styles.detailList}>
                <h3 className={styles.title}>人员信息相关</h3>
                <Row gutter={{ md: 8, lg: 20, xl: 40 }} type="flex" align="middle">
                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>所属项目</span>
                    <span>{detail.career.project}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>项目经理</span>
                    <span>{detail.career.pm}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>职位</span>
                    <span>{detail.position}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>级别</span>
                    <span>
                      {detail.position_level.slice(detail.position_level.indexOf('-') + 1)}
                    </span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>单价</span>
                    <span>{detail.career.s_money}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>计费方式</span>
                    <span>{detail.career.salary_type === 0 ? '按日计费' : '按月计费'}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>招聘形式</span>
                    <span>{detail.career.use_hr_service ? '平台招聘' : '自主招聘'}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>入项时间</span>
                    <span>{detail.career.start}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>出项时间</span>
                    <span>{detail.career.end ? detail.career.end : '无'}</span>
                  </Col>
                </Row>
              </div>

              <div className={styles.detailList}>
                <h3 className={styles.title}>加班相关</h3>
                <Row gutter={{ md: 8, lg: 20, xl: 40 }} type="flex" align="middle">
                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>人员加班补偿方案</span>
                    <span>{detail.career.company.shift_type === 0 ? '倒休' : '加班'}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>工作日加班补偿系数</span>
                    <span>{detail.career.company.work_day_shift_rate}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>周末加班补偿系数</span>
                    <span>{detail.career.company.weekend_shift_rate}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>节假日加班补偿系数</span>
                    <span>{detail.career.company.holiday_shift_rate}</span>
                  </Col>

                  {parseInt(detail.career.company.shift_type, 10) === 1 ? (
                    <Col span={8} md={8} sm={12} className={styles.detailItem}>
                      <span>加班费</span>
                      <span>{detail.payment.extra_salary.toFixed(2)}</span>
                    </Col>
                  ) : null}
                </Row>
              </div>

              <div className={styles.detailList}>
                <h3 className={styles.title}>工时相关</h3>
                <Row gutter={{ md: 8, lg: 20, xl: 40 }} type="flex" align="middle">
                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>出勤(h)</span>
                    <span>{detail.work_report.work_duration || 0}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>加班(h)</span>
                    <span>{detail.work_report.extra_work_duration || 0}</span>
                  </Col>

                  {parseInt(detail.career.company.shift_type, 10) === 0 ? (
                    <Col span={8} md={8} sm={12} className={styles.detailItem}>
                      <span>倒休(h)</span>
                      <span>{detail.work_report.shift_duration || 0}</span>
                    </Col>
                  ) : null}

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>旷工(h)</span>
                    <span>{detail.work_report.absent_days * 8}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>未入项(h)</span>
                    <span>
                      {detail.work_report.out_project_days
                        ? detail.work_report.out_project_days * 8
                        : 0}
                    </span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>态度分</span>
                    <span>{detail.attitude_score || '无'}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>能力分</span>
                    <span>{detail.ability_score || '无'}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>项目排名</span>
                    <span>{detail.rank || '无'}</span>
                  </Col>
                </Row>
              </div>

              <div className={styles.detailList}>
                <h3 className={styles.title}>费率相关</h3>
                <Row gutter={{ md: 8, lg: 20, xl: 40 }} type="flex" align="middle">
                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>平台服务费率</span>
                    <span>
                      {detail.career.company.service_fee_rate &&
                        `${round(detail.career.company.service_fee_rate * 100, 2)}%`}
                    </span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>平台服务费</span>
                    <span>{round(detail.payment.service_fee, 2)}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>综合税率</span>
                    <span>
                      {detail.career.company.tax_rate &&
                        `${round(detail.career.company.tax_rate * 100, 2)}%`}
                    </span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>税金费</span>
                    <span>{round(detail.payment.tax, 2)}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>HR服务费率</span>
                    <span>
                      {detail.career.company.hr_fee_rate &&
                        `${round(detail.career.company.hr_fee_rate * 100, 2)}%`}
                    </span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>HR服务费</span>
                    <span>{round(detail.payment.hr_fee, 2)}</span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>金融费率</span>
                    <span>
                      {detail.career.company.finance_rate &&
                        `${round(detail.career.company.finance_rate * 100, 2)}%`}
                    </span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>金融费</span>
                    <span>{round(detail.payment.finance_fee, 2)}</span>
                  </Col>
                </Row>
              </div>

              <div className={styles.detailList}>
                <h3 className={styles.title}>人员费用相关</h3>
                <Row gutter={{ md: 8, lg: 20, xl: 40 }} type="flex" align="middle">
                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>工位费</span>
                    <span>
                      {detail.payment.station_salary && round(detail.payment.station_salary, 2)}
                    </span>
                  </Col>

                  <Col span={8} md={8} sm={12} className={styles.detailItem}>
                    <span>人员服务费</span>
                    <span>{round(detail.payment.company_pay, 2)}</span>
                  </Col>
                </Row>
              </div>
            </Form>
          ) : (
            <span>暂无数据</span>
          )}
        </Modal>
      </>
    );
  }
}

export default PeopleDetail;

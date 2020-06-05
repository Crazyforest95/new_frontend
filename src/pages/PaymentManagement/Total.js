import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './style.less'

const billingCycle = {
  1: '一个月到账期',
  3: '三个月到账期'
}

class Total extends PureComponent {

  static propTypes = {
    showTotal: PropTypes.func.isRequired,
    totalDisplay: PropTypes.string.isRequired,
    total: PropTypes.isRequired
  }

  render() {
    const { showTotal, totalDisplay, total = {} } = this.props;
    return (
      <div className={styles.total_wrapper} style={{ display: totalDisplay }} onClick={() => { showTotal('none') }}>
        <div className={styles.total_info_box}>
          <div>
            <span>资金方式</span>
            <span>{billingCycle[total.billing_cycle]}</span>
          </div>

          <div>
            <span>平台服务费率</span>
            <span>{`${total.service_fee_rate * 100}%`}</span>
          </div>

          <div>
            <span>平台招聘费率</span>
            <span>{`${total.hr_fee_rate * 100}%`}</span>
          </div>

          <div>
            <span>综合税率</span>
            <span>{`${total.tax_rate * 100}%`}</span>
          </div>

          <div>
            <span>金融费率</span>
            <span>{`${total.finance_rate * 100}%`}</span>
          </div>
        </div>
      </div>
    )
  }

}

export default Total;
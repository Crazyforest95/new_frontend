import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import WageCard from './WageCard';

@connect(({ payment, loading }) => ({
  list: payment.list,
  loading: loading.effects['payment/getList'], // 是否加载loading
}))
class Unpaid extends PureComponent {
  state = {};

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {}

  // 获取列表
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'payment/getList',
      payload: {
        schema: 'UnChekcedPayments',
      },
    });
  };

  render() {
    const { list } = this.props;
    return (
      <PageHeaderWrapper>
        {list.length > 0 ? (
          list.map(details => <WageCard type="unpaid" details={details} onSuccess={this.getList} />)
        ) : (
          <p style={{ textAlign: 'center' }}>暂无数据</p>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Unpaid;

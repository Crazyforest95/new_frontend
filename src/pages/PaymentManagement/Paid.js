import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Pagination } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import WageCard from './WageCard';

@connect(({ paymentManagement, loading }) => ({
  list: paymentManagement.list,
  loading: loading.effects['paymentManagement/getList'], // 是否加载loading
}))
class Unpaid extends PureComponent {
  state = {
    page: 1,
    per_page: 10,
  };

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {}

  // 获取列表
  getList = () => {
    const { dispatch } = this.props;
    const { page, per_page } = this.state; // eslint-disable-line
    dispatch({
      type: 'paymentManagement/getList',
      payload: {
        schema: 'MonthlyBillSchema',
        per_page,
        page,
      },
    });
  };

  pageChange = page => {
    this.setState(
      {
        page,
      },
      () => this.getList()
    );
  };

  render() {
    const { list: { page_info: { total }, data } = {} } = this.props;
    const { page } = this.state;
    return (
      <PageHeaderWrapper>
        {data.length > 0 ? (
          <>
            {data.map(details => (
              <WageCard details={details} onSuccess={this.getList} />
            ))}
            <Pagination current={page} onChange={this.pageChange} total={total} />
          </>
        ) : (
          <p style={{ textAlign: 'center' }}>暂无数据</p>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Unpaid;

import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FeeManagement from '../FeeManagement/FeeManagement';

import styles from './style.less';

class PriceListManagement extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <PageHeaderWrapper title="报价管理">
        <FeeManagement way="day" />
        <div className={styles.blackSpace}>&nbsp;</div>
        <FeeManagement way="month" />
      </PageHeaderWrapper>
    );
  }
}

export default PriceListManagement;

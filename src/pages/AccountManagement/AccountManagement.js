import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProjectManagement from '../ProjectManagement/ProjectManagement';
import Purchase from '../Purchase/Purchase';

import styles from './style.less';

class AccountManagement extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <PageHeaderWrapper title="账号管理">
        <Purchase />
        <div className={styles.blackSpace}>&nbsp;</div>
        <ProjectManagement />
      </PageHeaderWrapper>
    );
  }
}

export default AccountManagement;

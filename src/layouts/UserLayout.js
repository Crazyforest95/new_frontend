import React from 'react';
// import Link from 'umi/link';
// import { Icon } from 'antd';
// import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';

// const copyright = (
//   <Fragment>
//     Copyright <Icon type="copyright" /> 2019 西安金牛创智科技有限公司
//   </Fragment>
// );

const UserLayout = ({ children }) => (
  // @TODO <DocumentTitle title={this.getPageTitle()}>
  <div className={styles.container}>
    <div className={styles.lang}>
      <SelectLang />
    </div>
    <div className={styles.content}>
      {/* <div className={styles.top}>
        <div className={styles.header}>
          <Link to="/">
            <img alt="logo" className={styles.logo} src={logo} />
            <span className={styles.title}>牛咖</span>
          </Link>
        </div>
      </div> */}
      {children}
    </div>
    {/* <GlobalFooter copyright={copyright} /> */}
  </div>
);

export default UserLayout;

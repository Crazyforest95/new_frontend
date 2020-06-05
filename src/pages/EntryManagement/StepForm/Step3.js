import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ form }) => ({
  data: form.step,
}))
class Step3 extends React.PureComponent {
  render() {
    const { finish } = this.props;
    const onFinish = () => {
      finish();
    };
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          确定
        </Button>
      </Fragment>
    );
    return (
      <Result type="success" title="采购订单创建成功" actions={actions} className={styles.result} />
    );
  }
}

export default Step3;

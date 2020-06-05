import React, { PureComponent, Fragment } from 'react';
import { Card, Steps } from 'antd';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

import styles from '../style.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  state = {
    currentStep: 0,
  };

  changeStep = step => {
    this.setState({
      currentStep: step,
    });
  };

  render() {
    const { currentStep } = this.state;
    const { finish, isRenew } = this.props;
    return (
      <>
        <Card bordered={false}>
          <Fragment>
            <Steps current={currentStep} className={styles.steps} labelPlacement="vertical">
              <Step title="提交采购订单信息" />
              <Step title="生成采购订单" />
              <Step title="采购订单创建成功" />
            </Steps>
            {currentStep === 0 && <Step1 changeStep={this.changeStep} isRenew={isRenew} />}
            {currentStep === 1 && <Step2 changeStep={this.changeStep} isRenew={isRenew} />}
            {currentStep === 2 && <Step3 finish={finish} />}
          </Fragment>
        </Card>
      </>
    );
  }
}

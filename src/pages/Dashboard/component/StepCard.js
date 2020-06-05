import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

import styles from './StepCard.less';

export default class Workplace extends PureComponent {
  static defaultProps = {
    title: '',
    content: '',
    action: null,
  };

  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    step: PropTypes.number.isRequired,
    action: PropTypes.node,
  };

  render() {
    const { title, content, step, action } = this.props;

    return (
      <div className={styles['step-card']}>
        <div className={styles.step}>{step}</div>
        <div>
          <Card
            style={{ width: 200 }}
            actions={action && [action]}
            title={title}
            size="small"
            bordered={false}
          >
            {content}
          </Card>
        </div>
      </div>
    );
  }
}

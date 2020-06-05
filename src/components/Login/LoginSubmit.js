/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
import React from 'react';
import classNames from 'classnames';
import { Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

const LoginSubmit = ({ className, ...rest }) => {
  const clsString = classNames(styles.submit, className);
  return (
    <FormItem>
      <button className={clsString} htmlType="submit" {...rest}>
      </button>
    </FormItem>
  );
};

export default LoginSubmit;

/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Alert } from 'antd';
import styled from 'styled-components';
import Login from '@/components/Login';

import styles from './Login.less';
import selectedRadio from '../../../public/images/icon_key_s@2x.png';
import unSelectRadio from '../../../public/images/icon_key_n@2x.png';
import code from '../../../public/images/code.jpg';
import logo from '../../../public/images/icon_logo@2x.png';

const { Tab, UserName, Password, Submit } = Login;

const Logo = styled.img`
  position: absolute;
  top: 30px;
  left: 15vw;
`;

const CompanyTitle = styled.section`
  position: absolute;
  top: 30px;
  right: 15vw;
  color: #fff;
  font-size: 25px;
`;

const CompanyIntroduce = styled.section`
  position: absolute;
  top: 35vh;
  left: 15vw;
  color: #fff;
`;

const H2 = styled.h2`
  color: #fff;
  font-weight: 500;
  font-size: 28px;
  letter-spacing: 2px;
`;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    radioIcon: selectedRadio,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      const newValues = { ...values, port: 'cm' };
      dispatch({
        type: 'login/login',
        payload: {
          ...newValues,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState(
      {
        autoLogin: e.target.checked,
      },
      () => {
        const { autoLogin } = this.state;
        this.setState({
          radioIcon: autoLogin ? selectedRadio : unSelectRadio,
        });
      }
    );
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin, radioIcon } = this.state;
    return (
      <div>
        <div className={styles.main}>
          <Login
            defaultActiveKey={type}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
              {login.status === 'error' &&
                login.type === 'account' &&
                !submitting &&
                this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
              <UserName
                name="username"
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.userName.required' }),
                  },
                ]}
              />
              <Password
                name="password"
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.password.required' }),
                  },
                  {
                    message: '密码必须是8-16位的字母、数字组合（以字母开头）',
                    pattern: /^([A-Za-z])(?![a-zA-Z]+$)[0-9A-Za-z]{7,15}$/,
                  },
                ]}
                onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
              />
              <div>
                <label htmlFor="myradio" className={styles.radio_label}>
                  <img src={radioIcon} alt="记住密码" className={styles.radio_img} />
                  <FormattedMessage id="app.login.remember-me">记住密码</FormattedMessage>
                  <input
                    type="checkbox"
                    checked={autoLogin}
                    id="myradio"
                    style={{ display: 'none' }}
                    onChange={this.changeAutoLogin}
                  />
                </label>
              </div>
              <Submit loading={submitting}>
                <FormattedMessage id="app.login.login" />
              </Submit>

              <div className={styles.footWrap}>
                <span>公司管理员登录问题请联系牛咖官方微信客服：NewCom_CS</span>
                <span>采购登录问题请联系本公司管理员</span>
              </div>
            </Tab>

            <Tab key="other" tab={formatMessage({ id: 'app.login.tab-login-other' })}>
              <div className={styles.box_type_two}>
                <h3>登录方式一</h3>
                <div className={styles.box_code_type}>
                  <div>
                    <img src={code} alt="公众号二维码" />
                  </div>
                  <div className={styles.code_type_content}>
                    <p>1.微信扫描二维码关注公众号</p>
                    <span>【牛咖外包管理平台】</span>
                    <p>2.进入登录入口</p>
                    <span>输入账号及密码登录</span>
                  </div>
                </div>
              </div>

              <div className={styles.box_type_two}>
                <h3>登录方式二</h3>
                <a
                  style={{ marginTop: '30px', color: '#fff' }}
                  className={styles.link}
                  target="_blank"
                  href="https://m.newcom.ren"
                >
                  使用网页快速登录
                </a>
              </div>
            </Tab>
          </Login>
        </div>

        <Logo src={logo} alt="牛咖" />

        <CompanyTitle>牛咖NEWCOME</CompanyTitle>

        <CompanyIntroduce>
          <H2>牛咖 . 省钱高效的外包管理工具</H2>
          <span style={{ color: '#D9FCFF', fontSize: '23px' }}>
            Cost-saving and efficient outsourcing management tools
          </span>
        </CompanyIntroduce>
      </div>
    );
  }
}

export default LoginPage;

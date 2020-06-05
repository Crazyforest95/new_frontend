import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ChangePassword from './ChangePassword';
// import styles from './style.less';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  submitting: loading.effects['user/update'],
  user: user.currentUser,
}))
@Form.create()
class PersonalSetting extends PureComponent {
  state = {
    editor: false,
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const param = {
          schema: 'BaseUserPut',
          ...values,
        };
        dispatch({
          type: 'user/update',
          payload: param,
          callback: () => {
            dispatch({
              type: 'user/fetchCurrent',
            });
            this.setState({
              editor: false,
            });
          },
        });
      }
    });
  };

  onEditor = () => {
    this.setState({
      editor: true,
    });
  };

  cancelEditor = () => {
    this.setState({
      editor: false,
    });
  };

  fetchCurrent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      user,
      submitting,
    } = this.props;
    const { editor } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const action = (
      <>
        {editor ? (
          <>
            <Button type="primary" onClick={this.cancelEditor}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
              提交
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={this.onEditor}>
            编辑
          </Button>
        )}
      </>
    );

    return (
      <PageHeaderWrapper hiddenBreadcrumb title="个人设置" action={action}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            {user.role === 'company_om' && (
              <FormItem {...formItemLayout} label="账号">
                {editor
                  ? getFieldDecorator('username', {
                      rules: [
                        {
                          required: true,
                          message: '请输入账号',
                        },
                      ],
                      initialValue: user.username,
                    })(<Input placeholder="请输入账号" />)
                  : user.username}
              </FormItem>
            )}

            {user.role === 'purchase' && (
              <>
                <FormItem {...formItemLayout} label="手机号吗">
                  {editor
                    ? getFieldDecorator('phone', {
                        rules: [
                          {
                            required: true,
                            message: '请输入手机号吗',
                          },
                          {
                            message: '请输入正确电话号码',
                            pattern: /^1[3456789]\d{9}$/,
                          },
                        ],
                        initialValue: user.phone,
                      })(<Input placeholder="请输入手机号吗" />)
                    : user.phone}
                </FormItem>
                <FormItem {...formItemLayout} label="邮箱地址">
                  {editor
                    ? getFieldDecorator('email', {
                        rules: [
                          {
                            required: true,
                            message: '请输入邮箱',
                          },
                          {
                            type: 'email',
                            message: '请输入正确的邮箱格式',
                          },
                        ],
                        initialValue: user.email,
                      })(<Input placeholder="请输入邮箱" maxLength={64} />)
                    : user.email}
                </FormItem>
              </>
            )}
            <FormItem colon={false} label={<span>密码</span>} {...formItemLayout}>
              <ChangePassword id={user.id} onSuccesss={this.fetchCurrent} />
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PersonalSetting;

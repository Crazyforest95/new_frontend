import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Button, Radio, Alert } from 'antd';
import styles from './style.less';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const salaryType = {
  0: '日',
  1: '月',
};

@connect(({ form = {} }) => ({
  data: form.step,
}))
@Form.create()
class Step1 extends React.PureComponent {
  render() {
    /* eslint-disable */
    const {
      data: {
        engineer = {},
        position_level = {},
        start_date,
        salary_type,
        project,
        service_type,
        auto_renew,
        renew_cycle,
        work_place,
        end_date,
      } = {},
      data,
      dispatch,
      changeStep,
      form,
      isRenew,
    } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const entryDetail = { ...data, ...values };
          dispatch({
            type: 'form/saveStepFormData',
            payload: entryDetail,
          });
          changeStep(1);
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="乙方姓名">
            {engineer.real_name}
          </Form.Item>
          <Form.Item {...formItemLayout} label="项目名成">
            {project}
          </Form.Item>
          <Form.Item {...formItemLayout} label="工作内容">
            {getFieldDecorator('work_content', {
              initialValue: data.work_content,
              rules: [
                { required: true, message: '工作内容不可为空' },
                {
                  max: 200,
                  message: '工作内容最大长度为200',
                },
              ],
            })(<TextArea style={{ width: 'calc(100% - 100px)' }} rows={4} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="采购订单开始时间">
            {isRenew
              ? moment(start_date).format('YYYY年MM月DD日')
              : moment(end_date)
                  .add(1, 'day')
                  .format('YYYY年MM月DD日')}
          </Form.Item>
          <Form.Item {...formItemLayout} label="工作地点">
            {work_place}
          </Form.Item>
          <Form.Item {...formItemLayout} label="服务方式">
            {getFieldDecorator('service_type', {
              initialValue: service_type || '现场',
              rules: [
                { required: true, message: '服务方式不可为空' },
                {
                  max: 16,
                  message: '服务方式最大长度为16',
                },
              ],
            })(
              <Radio.Group name="radiogroup">
                <Radio value="现场">现场</Radio>
                <Radio value="远程">远程</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="计费方式">
            {`按${salaryType[salary_type]}计费`}
          </Form.Item>
          <Form.Item {...formItemLayout} label="职位">
            {position_level.position}
          </Form.Item>
          <Form.Item {...formItemLayout} label="级别">
            {position_level.name}
          </Form.Item>
          <Form.Item {...formItemLayout} label="价格">
            {`${position_level.money}元/${salaryType[salary_type]}`}
          </Form.Item>
          {isRenew && (
            <Form.Item {...formItemLayout} label="续费方式">
              {getFieldDecorator('auto_renew', {
                initialValue: auto_renew || 0,
                rules: [{ required: true, message: '请选择续费方式' }],
              })(
                <Radio.Group name="radiogroup">
                  <Radio value={0}>自动续签</Radio>
                  <Radio value={1}>手动续签</Radio>
                </Radio.Group>
              )}
              {getFieldValue('auto_renew') == 0 && (
                <Alert
                  description="提示：当前采购订单剩余15天时自动续签下一份采购订单"
                  type="info"
                />
              )}
            </Form.Item>
          )}
          <Form.Item {...formItemLayout} label="续费时间">
            {getFieldDecorator('renew_cycle', {
              initialValue: renew_cycle,
              rules: [{ required: true, message: '请选择续费时间' }],
            })(
              <Radio.Group name="radiogroup">
                <Radio value={3}>3个月</Radio>
                <Radio value={6}>6个月</Radio>
                <Radio value={12}>1年</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default Step1;

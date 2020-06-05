import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Button, Divider, Table, message } from 'antd';
import styles from './style.less';

const salaryType = {
  0: '按日计费',
  1: '按月计费',
};

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ form, loading }) => ({
  submitting: loading.effects['enterProjects/add'],
  data: form.step,
}))
@Form.create()
class Step2 extends React.PureComponent {
  submit = () => {
    const { isRenew } = this.props;
    if (isRenew) {
      return this.enterProject();
    }
    return this.renewOrder();
  };

  enterProject = () => {
    const { dispatch, data, changeStep } = this.props;
    dispatch({
      type: 'enterProjects/add',
      payload: {
        ...data,
        schema: 'EnterProjectCompanyFileAuditSchema',
        yes_or_no: 1,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
          changeStep(2);
        } else {
          message.error('错误');
        }
      },
    });
  };

  renewOrder = () => {
    const { dispatch, data, changeStep } = this.props;
    dispatch({
      type: 'engineer/renewOrder',
      payload: {
        ...data,
        id: data.engineer.id,
        schema: 'EngineerRenewOrderSchema',
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
          changeStep(2);
        } else {
          message.error('错误');
        }
      },
    });
  };

  render() {
    const {
      submitting,
      changeStep,
      data: {
        engineer = {},
        position_level = {}, // eslint-disable-line
        project,
      },
      data,
    } = this.props;
    const onPrev = () => {
      changeStep(0);
    };
    const list = [
      {
        name: '乙方姓名',
        content: engineer.real_name,
      },
      {
        name: '项目名称',
        content: project,
      },
      {
        name: '工作内容',
        content: data.work_content,
      },
      {
        name: '工作期限',
        content: `预计自
      ${moment(data.start_date).format('YYYY年MM月DD日')}
      至
      ${moment(data.start_date)
        .add(data.renew_cycle, 'M')
        .format('YYYY年MM月DD日')},
      具体按项目实际时间执行
      `,
      },
      {
        name: '工作地点',
        content: data.work_place,
      },
      {
        name: '服务方式',
        content: data.service_type,
      },
      {
        name: '职位',
        content: position_level.position,
      },
      {
        name: '级别',
        content: position_level.name,
      },
      {
        name: '计费方式',
        content: salaryType[data.salary_type],
      },
      {
        name: '价格',
        content: (
          <>
            <div>
              {position_level.money}元/{data.salary_type === 0 ? '日' : '月'}
            </div>
            <div> 按照实际工作日以及乙方的实际工作效果 来计算该月的总费用。</div>
            <div>此价格包含所有费用，甲方将不再承担任何费用</div>
          </>
        ),
      },
      {
        name: '付款方式',
        content: (
          <>
            <div>
              乙方根据甲方确认的乙方人员的工作报告按上述价格向甲方开出对应月的增值税专用发票
            </div>
            <div>
              甲方在收到甲方项目经理签字确认并加盖公章的工作报告和乙方正式发票后15个工作日内付款给乙方
            </div>
          </>
        ),
      },
    ];
    const columns = [
      {
        title: '条目',
        dataIndex: 'name',
        width: '15%',
        align: 'center',
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: '85%',
      },
    ];

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Table
          columns={columns}
          rowKey={record => record.id}
          // dataSource={list.data}
          dataSource={list}
          bordered
          pagination={false}
        />
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={this.submit} loading={submitting}>
            创建采购订单
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Step2;

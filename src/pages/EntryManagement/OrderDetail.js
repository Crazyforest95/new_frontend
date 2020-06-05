import React, { Fragment } from 'react';
import { Modal, Table } from 'antd';
import { connect } from 'dva/index';
import moment from 'moment/moment';
import { engineerCompanyOrders } from '@/services/enterProjects';

const salaryType = {
  0: '按日计费',
  1: '按月计费',
};

const autoRenew = {
  0: '自动续签',
  1: '手动续签',
};

@connect(({ projectManagement, loading }) => ({
  list: projectManagement.list,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
class Detail extends React.Component {
  static defaultProps = {
    detail: {},
  };

  state = {
    visible: false,
    detail: {
      engineer: {},
      career: { position_level: {} }, // eslint-disable-line
      project: {},
    },
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.getDetail();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  getDetail = () => {
    const { engineerId, id } = this.props;
    const params = { engineer_id: engineerId, sort_id: -1, id };
    engineerCompanyOrders(params).then(res => {
      if (res) {
        this.setState({
          detail: res.data[0],
        });
      }
    });
  };

  render() {
    const { visible } = this.state;
    /* eslint-disable */
    const {
      detail: {
        engineer = {},
        career: { position_level = {}, salary_type, work_place },
        project = {},
        auto_renew,
      },
      detail,
    } = this.state;

    const list = [
      {
        name: '乙方姓名',
        content: engineer.real_name,
      },
      {
        name: '项目名称',
        content: project.name,
      },
      {
        name: '工作内容',
        content: detail.work_content,
      },
      {
        name: '工作期限',
        content: `预计自
      ${moment(detail.start_date).format('YYYY年MM月DD日')}
      至
      ${moment(detail.end_date).format('YYYY年MM月DD日')},
      具体按项目实际时间执行
      `,
      },
      {
        name: '工作地点',
        content: work_place,
      },
      {
        name: '服务方式',
        content: detail.service_type,
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
        content: salaryType[salary_type],
      },
      {
        name: '价格',
        content: (
          <>
            <div>
              {position_level.money}元/{salary_type === 0 ? '日' : '月'}
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
      {
        name: '续签方式',
        content: autoRenew[auto_renew],
      },
      {
        name: '采购订单创建时间',
        content: moment(detail.created).format('YYYY年MM月DD日 HH:mm'),
      },
    ];
    /* eslint-enable */

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
      <Fragment>
        <span>
          <span onClick={this.showModal} style={{color:'#1890ff',cursor:'pointer'}}>采购订单</span>
        </span>
        <Modal
          title="采购订单信息"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={850}
          destroyOnClose
          maskClosable={false}
          footer={null}
        >
          <Table
            columns={columns}
            rowKey={record => record.id}
            // dataSource={list.data}
            dataSource={list}
            bordered
            pagination={false}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default Detail;

import React from 'react';
import { connect } from 'dva/index';
import { Modal, Form, Row, Col, Table, Button } from 'antd';
import styles from './style.less';

const columns = [
  {
    title: '面试日期',
    dataIndex: 'name',
  },
  {
    title: '面试时间',
    dataIndex: 'project',
  },
  {
    title: '姓名',
    dataIndex: 'pm.real_name',
  },
  {
    title: '面试官',
    dataIndex: 'pm.real_name',
  },
  {
    title: '需求项目',
    dataIndex: 'pm.real_name',
  },
  {
    title: '所属需求',
    dataIndex: 'pm.real_name',
  },
];

@connect(({ projects, loading }) => ({
  projects: projects.list.data,
  loading: loading.effects['requirementManagement/getDetail'], // 是否加载loading
}))
@Form.create()
class Detail extends React.Component {
  state = {
    visible: false,
    page: 1,
    per_page: 10,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    // this.getProjects();
  };

  getProjects = () => {
    const { dispatch, companyId, id } = this.props;
    dispatch({
      type: 'projects/getList',
      payload: { company_id: companyId, id, ...this.state },
    });
  };

  handleOk = () => {
    const { update, id } = this.props;
    const prop = this.props;
    const { validateFields, resetFields } = prop.form;
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      const sendParams = {
        ...fieldsValue,
        company_id: prop.companyId,
        id,
        schema: 'OfferModifySchema',
      };
      update(sendParams);
      this.setState({
        visible: false,
      });
    });
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 分页
  handleChange = pagination => {
    this.setState(
      {
        page: pagination.current,
      },
      () => {
        this.getList();
      }
    );
  };

  render() {
    const { visible } = this.state;
    const { list } = this.props;
    const pagination = {
      pageSize: 10,
      total: (list && list.page_info && list.page_info.total) || 10,
    };
    return (
      <span>
        <Button type="primary" onClick={this.showModal}>
          面试安排
        </Button>
        <Modal
          title="面试安排"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          destroyOnClose
          footer={null}
        >
          <Row gutter={{ md: 8, lg: 20, xl: 40 }}>
            <Col span={5}>今日待面 ：0</Col>
            <Col span={5}>明日待面 ：2</Col>
            <Col span={5}>本周待面 ：12</Col>
          </Row>
          <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={[{ id: 12 }, { id: 15 }]}
            className={styles.detailCard}
            onChange={this.handleChange} // 点击分页回掉事件
            pagination={{ ...pagination }} // 分页配置
          />
        </Modal>
      </span>
    );
  }
}

export default Detail;

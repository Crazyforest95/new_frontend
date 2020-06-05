import React, { PureComponent, Fragment } from "react"
import { connect } from "dva"
import { routerRedux } from "dva/router";
import { Card, Row, Col, Dropdown, Icon, Typography, Menu, message, Modal } from "antd"
import { configConsumerProps } from "antd/lib/config-provider";

import styles from './style.less';
import { MenuItem } from "@material-ui/core";


const { Title, Text } = Typography

class Badge extends PureComponent {
    render() {
      return (<span className={styles.requirementBadge}>{this.props.count}</span>)
    }
}
@connect(({}) => ({}))
class RequirementCard extends PureComponent {
  toResumeDetail = id => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push(`/requirementManagement/${id}`));
  };

  cancelOffer = (id) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'requirementManagement/close',
      payload: {
        id,
        schema: 'CloseOffer'
      },
      callback: datas => {
        if (datas.success === 1) {
          message.success('提交成功');
          this.props.action();
        } else {
          message.error('错误');
        }
      },
    })
  }

  displayMessage = (txt) => {
    message.info(txt);
  }

  confirmModal = (id) => {
    Modal.confirm({
        icon: null,
        centered: true,
        width: 300,
        title: <div style={{textAlign: 'center'}}>提示</div>,
        content: (<div style={{textAlign: 'center'}}><p>是否确定关闭需求？</p><p style={{marginBottom: 0}}>此操作不可逆，请谨慎操作</p></div>),
        okText: "确定",
        cancelText: "取消",
        onOk: () => this.cancelOffer(id),
    });
  }

    render() {
      const menu = {
        render: data => {
          const {id} = data;
          return (
            <Menu>
              <Menu.Item key="0">
                <a href="#" onClick={()=>this.displayMessage('当前版本暂不⽀持此功能')}>已读全部消息</a>
              </Menu.Item>
              <Menu.Item key="1">
                <a href="#" onClick={()=>this.confirmModal(id)}>关闭需求</a>
              </Menu.Item>
            </Menu>
        );
        }
      };

      const { lists } = this.props;
      const { hide_unread_nums } = this.props;

      return (
        <Row gutter={[20, 20]}>
          {lists.map((list, idx) => {
                  return (
                    <Col key={list.id} span={24} sm={12} md={8}>
                      <Card className={list.status === 'open' ? styles.cardActived : styles.cardDiactived} style={{minWidth: '280px'}}>
                        { hide_unread_nums === false ? <Badge count={list.un_read_counts} /> : <></> }

                        <Dropdown overlay={menu.render(list)} trigger={['click']} className={styles.moreIcon}>
                          <Icon type="more" />
                        </Dropdown>

                        <Row gutter={{ md: 10 }} className={styles.requirementFRow}>
                          <Col sm={18}>
                            <a>
                              <Title level={3} className={list.status === 'open' ? styles.cardTitle : styles.cardTitleClosed} onClick={() => this.toResumeDetail(list.id)}>
                                {list.name.length < 7 ? list.name : (`${list.name.slice(0, 6)  }...`) } 
                                <span className={styles.requirementStatus}>{list.status === 'open' ? '进行中' : '已关闭'}</span>
                              </Title>
                            </a>
                            <Text className={styles.cardBtnTitle}>更新于 {list.updated_datetime}</Text>
                          </Col>
                          <Col sm={6}>
                            <Title level={2} type="secondary">{list.cv_pass_amount === 0 ? 0 : Math.round(list.cv_pass_amount / list.cv_push_amount)}%</Title>
                            <Text type="secondary" className={styles.cardBtnTitle}>需求满足率</Text>
                          </Col>
                        </Row>
                        <Row className={styles.schedulesRow}>
                          <Col lg={8} md={12} sm={24}>
                            <Text className={styles.cardBtnTitle}>简历收集：{list.resume_collection_num}</Text>
                          </Col>
                          <Col lg={8} md={12} sm={24}>
                            <Text className={styles.cardBtnTitle}>笔试通过: {list.written_pass_num}</Text>
                          </Col>
                          <Col lg={8} md={24} sm={24}>
                            <Text className={styles.cardBtnTitle}>面试完成: {list.interview_pass_num}</Text>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  )
              })}
        </Row>
      )
  }
}

export default RequirementCard;

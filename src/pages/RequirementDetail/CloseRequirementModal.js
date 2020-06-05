import React from 'react'
import {
    Modal, Typography, Button, Row, Col, Card, message
} from 'antd'
const { Title, Text } = Typography;

import { connect } from 'dva/index';

@connect(({loading}) => ({
    loading: loading.effects['requiermentManagement/']
}))
export default class CloseRequirementModal extends React.PureComponent {
    state = {
        visible: false
    }

    cancelOffer = () => {
      const { dispatch } = this.props;

      const {id} = this.props;

      dispatch({
          type: 'requirementManagement/close',
          payload: {
            id,
            schema: 'CloseOffer'
          },
          callback: datas => {
            if (datas.success == 1) {
              message.success('提交成功');
            } else {
              message.error('错误');
            }
          },
        })
    }

    confirmModal = () => {
        Modal.confirm({
            icon: null,
            centered: true,
            width: 300,
            title: <div style={{textAlign: 'center'}}>提示</div>,
            content: (<div style={{textAlign: 'center'}}><p>是否确定关闭需求？</p><p style={{marginBottom: 0}}>此操作不可逆，请谨慎操作</p></div>),
            okText: "确定",
            cancelText: "取消",
            onOk: this.cancelOffer,
        });
    }

    render() {
        const {
            visible
        } = this.state
        return (
            <React.Fragment>
                <Button size="small" onClick={() => this.confirmModal()}>关闭需求</Button>
            </React.Fragment>
        )
    }
}
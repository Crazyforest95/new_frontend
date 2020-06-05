import React from 'react';
import { Modal } from 'antd';
import { entryFiles } from '@/services/enterProjects';

class ResumeDetails extends React.Component {
  state = {
    visible: false,
    data: '',
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.details();
  };

  details = () => {
    const { id } = this.props;
    const params = { engineer_id: id };
    entryFiles(params).then(res => {
      if (res) {
        this.setState({
          data: res,
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, data } = this.state;
    return (
      <span>
        <a onClick={this.showModal} style={{color:'#1890FF'}}>入项材料</a>
        <Modal
          title="入项材料"
          visible={visible}
          onCancel={this.handleCancel}
          width={1000}
          destroyOnClose
          maskClosable={false}
          footer={null}
        >
          {data && <embed src={data} type="application/pdf" width="100%" height="800px" />}
        </Modal>
      </span>
    );
  }
}

export default ResumeDetails;

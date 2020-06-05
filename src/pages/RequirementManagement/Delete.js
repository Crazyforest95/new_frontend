import React from 'react';
import { Modal, Form } from 'antd';

const { confirm } = Modal;

class Deletes extends React.Component {
  showDeleteConfirm = (deletes, ids) => {
    confirm({
      title: '是否删除?',
      okText: '是',
      okType: 'danger',
      onOk() {
        deletes({ ids });
      },
      cancelText: '否',
      onCancel() {},
    });
  };

  render() {
    const { deletes, id } = this.props;
    return (
      <span>
        <a type="primary" onClick={this.showDeleteConfirm.bind(this, deletes, id)}>
          删除
        </a>
      </span>
    );
  }
}

const Delete = Form.create()(Deletes);
export default Delete;

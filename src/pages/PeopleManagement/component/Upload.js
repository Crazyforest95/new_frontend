import React, { Fragment } from 'react';
import { Upload, Button } from 'antd';
import { connect } from 'dva/index';
import APP_CONFIG from '@/config';
import API from '@/api';
import { getToken } from '@/utils/authority';

@connect(({ projectManagement, loading }) => ({
  list: projectManagement.list,
  loading: loading.effects['projectManagement/getList'], // 是否加载loading
}))
class Add extends React.Component {
  render() {
    const { onChange, fileList, uploadFileList } = this.props;
    const token = getToken();
    const props = {
      action: `${APP_CONFIG.APP_HOST}${API.upload.contract}`,
      accept: '.pdf,.doc,.docx',
      headers: {
        Authorization: `Bearer ${token || ''}`,
        // Accept: 'application/json',
      },
      name: 'contract',
      // beforeUpload: file => {
      //   this.setState(state => ({
      //     fileList: [...state.fileList, file],
      //   }));
      // },
      fileList,
      onRemove: () => {
        onChange(null);
        uploadFileList(null);
      },
      onChange: res => {
        const len = res.fileList.length;

        uploadFileList(res.fileList.splice(len - 1));
        if (res.file.status === 'success' || res.file.status === 'done') {
          onChange(res.file.response);
        }
      },
    };
    return (
      <Fragment>
        <Upload {...props} showUploadList={{ showDownloadIcon: false }}>
          <Button type="primary">上传新文件</Button>
        </Upload>
      </Fragment>
    );
  }
}

export default Add;

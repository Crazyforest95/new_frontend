import React, { Fragment } from 'react';
import { message } from 'antd';
import Upload from 'rc-upload';

import APP_CONFIG from '@/config';
import API from '@/api';
import { getToken } from '@/utils/authority';

class SelfUpload extends React.PureComponent {
  static defaultProps = {
    onSuccess: () => null,
  };

  // state = {
  //   fileList: [],
  // };

  render() {
    const { onSuccess } = this.props;
    const token = getToken();
    const props = {
      action: `${APP_CONFIG.APP_HOST}${API.entryFileTemplate.upload}`,
      accept: '.pdf,.doc,.docx',
      headers: {
        Authorization: `Bearer ${token || ''}`,
        // Accept: 'application/json',
      },
      name: 'entry_file_template',
      onChange(file) {
        console.log(file)
      },
      onSuccess: () => {
        message.success(`上传成功`);
        onSuccess();
      },
      onError: () => {
        message.error(`上传失败`);
      },
    };
    return (
      <Fragment>
        <Upload {...props}>
          <a type="primary">替换</a>
        </Upload>
      </Fragment>
    );
  }
}

export default SelfUpload;

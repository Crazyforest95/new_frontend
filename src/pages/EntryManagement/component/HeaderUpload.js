import React from 'react';
import { Icon, Tooltip, Spin } from 'antd';
import { connect } from 'dva/index';
import styles from './HeaderUpload.less';

import Upload from './Upload';
import request from '@/utils/request';
import download from '@/utils/download';

const EntryMaterialTip =
  '请在word文件中写清入项材料要求。人员入项前会根据此文档的要求，上交入项材料。';

@connect(({ company, loading }) => ({
  detail: company.detail,
  loading: loading.effects['company/getDetail'], // 是否加载loading
}))
class Add extends React.PureComponent {
  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/getDetail',
      payload: {
        schema: 'CompanySimpleStatisticSchema',
      },
    });
  };

  download = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'enterProjects/getEntryFileTemplate',
      callback: data => {
        const file = JSON.parse(data);
        download(file.url)
      },
    });
  };

  render() {
    const { loading, detail } = this.props;
    return (
      <Spin spinning={loading}>
        <span className={styles.title}>
          入项材料要求
          <Tooltip placement="bottom" title={EntryMaterialTip}>
            <Icon type="exclamation-circle" />
          </Tooltip>
        </span>

        <span className={styles.fileName}>{detail.entry_file_template}</span>

        <Icon className={styles.download} type="download" onClick={this.download} />
        <Upload onSuccess={this.getDetail} />
      </Spin>
    );
  }
}

export default Add;

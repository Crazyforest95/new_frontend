import React, { PureComponent, Fragment } from 'react';
import { Table, Button, message, Popconfirm, Divider, Select, TreeSelect } from 'antd';
import isEqual from 'lodash/isEqual';
import work from '@/assets/work';

import styles from './style.less';

const { Option } = Select;

const level = {
  '1年': '1年',
  '1~3年': '1~3年',
  '3~5年': '3~5年',
  '5~10年': '5~10年',
  '10年及以上': '10年及以上',
};

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      level: '',
      name: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  shiftData = () => {
    const workData = [];
    Object.keys(work).forEach((tradeKey, index) => {
      workData.push({
        title: tradeKey,
        value: tradeKey,
        key: tradeKey + index,
        selectable: false,
        children: Object.keys(work[tradeKey]).map((jobeKey, indexs) => {
          return {
            title: jobeKey,
            value: jobeKey,
            key: jobeKey + indexs,
            selectable: false,
            children: work[tradeKey][jobeKey].map(key => {
              return {
                title: key,
                value: key,
                key,
              };
            }),
          };
        }),
      });
    });
    return workData;
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(value, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.level || !target.name) {
        message.error('请填写完整技能信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const columns = [
      {
        title: '技能名称',
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TreeSelect
                treeData={this.shiftData()}
                placeholder="请选择"
                style={{ width: '100%' }}
                showSearch
                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              />
            );
          }
          return text;
        },
      },
      {
        title: '熟练程度',
        dataIndex: 'level',
        key: 'level',
        width: '35%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                // value={text}
                onChange={e => this.handleFieldChange(e, 'level', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="熟练程度"
                style={{ width: '100%' }}
              >
                {Object.keys(level).map(key => (
                  <Option value={level[key]}>{key}</Option>
                ))}
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增工作技能
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;

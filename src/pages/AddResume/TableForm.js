import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, DatePicker, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import styles from './style.less';

const { Option } = Select;

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
      school: '',
      major: '',
      degree: '',
      start_date: '',
      end_date: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
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
      if (new Date(target.start_date) >= new Date(target.end_date)) {
        message.error('结束时间不得早于或等于开始时间。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (
        !target.school ||
        !target.major ||
        !target.degree ||
        !target.start_date ||
        !target.end_date
      ) {
        message.error('请填写完整教育背景信息。');
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
        title: '开始时间',
        dataIndex: 'start_date',
        key: 'start_date',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <DatePicker
                // value={text}
                autoFocus
                onChange={e =>
                  this.handleFieldChange(moment(e).format('YYYY-MM-DD'), 'start_date', record.key)
                }
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="开始时间"
              />
            );
          }
          return text;
        },
      },
      {
        title: '结束时间',
        dataIndex: 'end_date',
        key: 'end_date',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <DatePicker
                // value={text}
                onChange={e =>
                  this.handleFieldChange(moment(e).format('YYYY-MM-DD'), 'end_date', record.key)
                }
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="结束时间"
              />
            );
          }
          return text;
        },
      },
      {
        title: '毕业院校',
        dataIndex: 'school',
        key: 'school',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e.target.value, 'school', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="毕业院校"
              />
            );
          }
          return text;
        },
      },
      {
        title: '专业',
        dataIndex: 'major',
        key: 'major',
        width: '18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e.target.value, 'major', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="专业"
              />
            );
          }
          return text;
        },
      },
      {
        title: '学历',
        dataIndex: 'degree',
        key: 'degree',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                // value={text}
                onChange={e => this.handleFieldChange(e, 'degree', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="学历"
                style={{ width: '100%' }}
              >
                <Option value="高中">高中</Option>
                <Option value="大专">大专</Option>
                <Option value="本科">本科</Option>
                <Option value="硕士">硕士</Option>
                <Option value="博士">博士</Option>
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
          新增教育背景
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;

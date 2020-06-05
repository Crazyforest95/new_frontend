import React, { Component, Fragment } from 'react';
import { Table, Button, message, Popconfirm, Divider, Input } from 'antd';
import { connect } from 'dva/index';
import { oneOf, bool, func, number } from 'prop-types';

import isEqual from 'lodash/isEqual';
import work from '@/assets/work';
import styles from './style.less';

@connect(({ requirementManagement, menu, loading }) => ({
  list: requirementManagement.list,
  companyId: menu.companyId,
  loading: loading.effects['requirementManagement/getList'], // 是否加载loading
}))
class TableForm extends Component {
  static propTypes = {
    isFunc: bool.isRequired,
    way: oneOf(['日', '月']).isRequired,
    onSuccess: func,
    positionId: number || null,
  };

  static defaultProps = {
    onSuccess: () => {},
    positionId: null,
  };

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
      money: '',
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

  // 删除
  deletes = id => {
    const { dispatch, onSuccess } = this.props;
    dispatch({
      type: 'levelManagement/delete',
      payload: {
        id,
      },
      callback: async datas => {
        if (datas) {
          message.success('删除成功');
          await onSuccess();
        } else {
          message.error('错误');
        }
      },
    });
  };

  // 增加
  add = data => {
    const { dispatch, onSuccess } = this.props;
    dispatch({
      type: 'levelManagement/add',
      payload: {
        ...data,
      },
      callback: datas => {
        if (datas) {
          message.success('增加成功');
          onSuccess();
        } else {
          message.error('错误');
        }
      },
    });
  };

  // 更新
  update = data => {
    const { dispatch, onSuccess } = this.props;
    dispatch({
      type: 'levelManagement/update',
      payload: {
        ...data,
        schema: 'PositionLevelPutSchema',
      },
      callback: datas => {
        if (datas) {
          message.success('修改成功');
          onSuccess();
        } else {
          message.error('错误');
        }
      },
    });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange, isFunc } = this.props;
    const isNew = key.toString().match(/NEW_TEMP_ID_/);

    const newData = data.filter(item => item.key !== key);

    if (isFunc && !isNew) {
      this.deletes(key);
      return;
    }

    this.setState({ data: newData });
    if (!isFunc) {
      onChange(newData);
    }
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
      const { isFunc, positionId } = this.props;
      const Reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;

      if (!target.name || !target.money) {
        message.error('请填写完整技能信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (target.name.length > 16) {
        message.error('级别最大长度为16。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }

      if (!Reg.test(target.money)) {
        message.error('请输入最多两位小数的价格且不能为负数');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }

      if (target.isNew && isFunc) {
        this.add({ ...target, position_id: positionId });
      }
      if (!target.isNew && isFunc) {
        this.update(target);
      }

      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      if (!isFunc) {
        onChange(data);
      }
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
    // eslint-disable-next-line no-unused-vars
    const { way, value } = this.props;

    const columns = [
      {
        title: '级别',
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e.target.value, 'name', record.key)}
                onKeyPress={e => this.handleKeyPress(e.target.value, record.key)}
                placeholder="请输入级别"
                style={{ width: '100%' }}
                maxLength={16}
              />
            );
          }
          return text;
        },
      },
      {
        title: '价格',
        dataIndex: 'money',
        key: 'money',
        width: '35%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                // type="number"
                onChange={e => this.handleFieldChange(e.target.value, 'money', record.key)}
                onKeyPress={e => this.handleKeyPress(e.target.value, record.key)}
                placeholder="请输入价格"
                style={{ width: '100%' }}
                addonAfter={`元/${way}`}
              />
            );
          }
          return `${text} 元/${way}`;
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
          添加新级别
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;

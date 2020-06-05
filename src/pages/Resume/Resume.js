import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, Input, Select } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import TagSelect from '@/components/TagSelect';
// import StandardFormRow from '@/components/StandardFormRow';
// import work from './work'
// import ArticleListContent from '@/components/ArticleListContent';
// import './style.less';

// const FormItem = Form.Item;
// const { Panel } = Collapse;
const InputGroup = Input.Group;
const { Option } = Select;

@connect(({ engineer, loading }) => ({
  list: engineer.list,
  loading: loading.effects['engineer/getList'], // 是否加载loading
}))
@Form.create()
class Resume extends PureComponent {
  state = {
    // selectedRowKeys: [],
    page: 1,
    per_page: 10,
    rules: 'like_real_name',
  };

  componentDidMount() {
    this.getList();
    const { dispatch } = this.props;

    dispatch({
      type: 'menu/hideMenu',
    });
    dispatch({
      type: 'menu/showResumeMenu',
    });
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 查询
  getSearch = value => {
    this.setState(
      {
        page: 1,
        per_page: 10,
      },
      () => this.getList(value)
    );
  };

  // 获取列表
  getList = value => {
    const { dispatch } = this.props;
    const { rules } = this.state;

    dispatch({
      type: 'engineer/getList',
      payload: {
        ...this.state,
        // status: 'ready',
        sort_id: -1,
        [rules]: value,
      },
    });
  };

  // 分页
  handleChange = pagination => {
    this.setState(
      {
        page: pagination.current,
      },
      () => {
        this.getList();
      }
    );
  };

  // 点击管理跳转
  toRequirementDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/resumeDetails?id=${id}`));
  };

  render() {
    const { list, loading } = this.props;
    const { rules } = this.state;
    const pagination = { pageSize: 10, total: list.page_info.total };
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        render: (data, all, index) => {
          return index + 1;
        },
      },
      {
        title: '姓名',
        dataIndex: 'real_name',
        width: 110,
      },
      {
        title: '性别',
        dataIndex: 'gender',
        render: gender => {
          if (gender === 0) {
            return '女';
          }
          return '男';
        },
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '上传简历',
        dataIndex: 'cv_name',
        render: cvName => {
          if (cvName) {
            return '是';
          }
          return '否';
        },
      },
      {
        title: '求职状态',
        dataIndex: 'job_wanted_status',
        render: status => {
          if (status === 'positive') {
            return '积极找工作';
          }
          if (status === 'negative') {
            return '暂时不换工作';
          }
          return '随便看看';
        },
      },
      {
        title: '操作',
        render: data => (
          <Fragment>
            <a onClick={() => this.toRequirementDetail(data.id)}>进入</a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderWrapper
        title="简历库"
        content={
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <InputGroup compact size="large">
              <Select
                value={rules}
                onChange={value =>
                  this.setState({
                    rules: value,
                  })
                }
                style={{ width: '10%' }}
              >
                <Option value="like_real_name">姓名</Option>
                <Option value="like__abilities">技能</Option>
                <Option value="like_phone">电话</Option>
                <Option value="like_email">邮箱</Option>
                <Option value="like_major">专业</Option>
              </Select>
              <Input.Search
                placeholder="请输入"
                enterButton="搜索"
                size="large"
                onSearch={value => this.getSearch(value)}
                style={{ width: '80%' }}
              />
            </InputGroup>
          </div>
        }
        hiddenBreadcrumb
      >
        {/* <PageHeaderWrapper */}
        {/* title="简历库" */}
        {/* content={ */}
        {/* <Collapse bordered={false}> */}
        {/* <Panel header={<div>简历筛选</div>} key="1"> */}
        {/* <div style={{ textAlign: 'center',marginBottom:'20px' }}> */}
        {/* <Input.Search */}
        {/* placeholder="请输入" */}
        {/* enterButton="搜索" */}
        {/* size="large" */}
        {/* // onSearch={this.handleFormSubmit} */}
        {/* style={{ width: '80%' }} */}
        {/* /> */}
        {/* </div> */}
        {/* <Form layout="inline"> */}
        {/* <StandardFormRow title="工作技能" block style={{ paddingBottom: 11 }}> */}
        {/* {Object.keys(work).map((key)=>{ */}
        {/* return ( */}
        {/* <StandardFormRow title={key} block style={{ paddingBottom: 11 }}> */}
        {/* {work[key]&&Object.keys(work[key]).map((job)=>{ */}
        {/* return ( */}
        {/* <StandardFormRow title={job} block style={{ paddingBottom: 11 }}> */}
        {/* <FormItem> */}
        {/* {getFieldDecorator('category')( */}
        {/* <TagSelect expandable actionsText={actionsTextMap}> */}
        {/* {work[key][job].map((skill)=>( */}
        {/* <TagSelect.Option value={skill}>{skill}</TagSelect.Option> */}
        {/* ))} */}
        {/* </TagSelect> */}
        {/* )} */}
        {/* </FormItem> */}
        {/* </StandardFormRow> */}
        {/* ) */}
        {/* }) */}
        {/* } */}
        {/* </StandardFormRow> */}
        {/* ) */}
        {/* })} */}
        {/* </StandardFormRow> */}
        {/* <StandardFormRow title="上传简历" grid> */}
        {/* <FormItem> */}
        {/* {getFieldDecorator('resume1')( */}
        {/* <TagSelect actionsText={actionsTextMap}> */}
        {/* <TagSelect.Option value="cat2">是</TagSelect.Option> */}
        {/* <TagSelect.Option value="cat3">否</TagSelect.Option> */}
        {/* </TagSelect> */}
        {/* )} */}
        {/* </FormItem> */}
        {/* </StandardFormRow> */}
        {/* <StandardFormRow title="求职状态" grid> */}
        {/* <FormItem> */}
        {/* {getFieldDecorator('resume2')( */}
        {/* <TagSelect actionsText={actionsTextMap}> */}
        {/* <TagSelect.Option value="cat2">积极找工作</TagSelect.Option> */}
        {/* <TagSelect.Option value="cat3">随便看看</TagSelect.Option> */}
        {/* <TagSelect.Option value="cat2">暂时不换工作</TagSelect.Option> */}
        {/* </TagSelect> */}
        {/* )} */}
        {/* </FormItem> */}
        {/* </StandardFormRow> */}
        {/* </Form> */}
        {/* </Panel> */}
        {/* </Collapse> */}
        {/* } */}
        {/* > */}
        <Card bordered={false} style={{ marginTop: 24 }}>
          <div>
            <Table
              loading={loading}
              // rowSelection={rowSelection}
              columns={columns}
              rowKey={record => record.id}
              dataSource={list.data}
              // dataSource={dataSource}
              onChange={this.handleChange} // 点击分页回掉事件
              pagination={{ ...pagination }} // 分页配置
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Resume;

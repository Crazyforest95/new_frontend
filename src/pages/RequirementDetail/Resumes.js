import React, { Fragment } from 'react';
import { message, Card, Row, Col, Checkbox, Typography, Button } from 'antd';
import { connect } from 'dva/index';

// cobra-55555 -20-04-25
import PeopleDetail from '@/components/PeopleDetail'; // 人员详情
import Resume from '@/pages/EntryManagement/Resume'; // 简历
import get from 'lodash/get';
// // // // //

import classes from './RequirementDetail.less';

const { Title, Text } = Typography

@connect(({ engineer, loading }) => ({
  list: engineer.list,
  loading: loading.effects['engineer/getList'], // 是否加载loading
}))
class Resumes extends React.Component {
  state = {
  };

  add = data => {
    const { dispatch, id, onSuccess } = this.props;
    dispatch({
      type: 'interview/add',
      payload: {
        offer_id: id,
        engineer_id: data.id,
      },
      callback: datas => {
        if (datas) {
          message.success('提交成功');
        } else {
          message.error('错误');
        }
        this.getList();
        onSuccess();
      },
    });
  };

  render() {
    const { lists, loading, resumeCheckHandle, selectedResumes } = this.props;

    // cobra-55555 -20-04-18  ---resume cards
    return (
      <Row gutter={[24, 16]}>
        {lists.map((list, idx) => (
          <Col md={6} key={idx}>
            <Card size="small" style={{minWidth: '200px'}}>
              <Row>
                <Col md={12}>
                  <Title level={3}>
                    <Checkbox className={classes.checkBox} 
                      onChange={($event) => {resumeCheckHandle(idx, $event.target.checked)}}
                      disabled={(selectedResumes.length >= 5) && !selectedResumes.filter(resume => resume.id === idx).length}
                    />
                    {/* <Text style={{color: '#2979FF'}}>{ list.name }</Text> */}
                    <Text style={{color: '#2979FF'}} className={classes.resumeCardTitle}>{ list.name }</Text>
                  </Title>
                </Col>
                <Col md={12} style={{textAlign: 'right'}}>
                  {/* <Title level={2}><Text style={{fontSize: 14}}>总成绩</Text>{ list.totalmark }</Title> */}
                  <Title level={2} className={classes.resumeCardLabel}><Text style={{fontSize: 16}} className={classes.resumeCardLabel}>总成绩</Text><span className={classes.resumeCardNum}>{ list.totalmark }</span></Title>
                </Col>
              </Row>
              {/* cobra-55555 -20-04-25 */}
              <Row gutter={12}>
                <Col md={12}>
                  {/* <Button type="primary" block>查看简历</Button> */}
                  <Resume detail={get(list, 'engineer.cv_path', [])} isRequirement />
                </Col>
                <Col md={12}>
                  {/* <Button type="primary" block>人员详情</Button> */}
                  <PeopleDetail id={list.engineer_id} isRequirement />
                </Col>
              </Row>
              {/* // // // // // */}
            </Card>
          </Col>
        ))}
      </Row>
    );
    // // // // //
  }
}

export default Resumes;

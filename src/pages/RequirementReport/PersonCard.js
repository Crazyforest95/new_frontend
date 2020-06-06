import React from 'react';
import { Row, Col, Card, Button, Tabs, Typography } from 'antd';
import classes from './RequirementReport.less';

const { Title, Text } = Typography;

export default class PersonCard extends React.PureComponent {
  state = {
    isSelected: false,
  };

  nameClicked = () => {
    const { isSelected } = this.state;
    const { resumeCheckHandle } = this.props;
    const { num } = this.props;

    if (isSelected === false) {
      const { selectedResumes } = this.props;
      if (selectedResumes.length >= 5) {
        return;
      }
      this.setState({ isSelected: true });
      resumeCheckHandle(num, true);
    } else {
      this.setState({ isSelected: false });
      resumeCheckHandle(num, false);
    }
  };

  checkSelected = () => {
    const { selectedResumes } = this.props;
    const { num } = this.props;
    this.setState({ isSelected: false });

    selectedResumes.forEach(selResItem => {
      if (selResItem.id === num) this.setState({ isSelected: true });
    });
  };

  render() {
    const { personData } = this.props;
    const { idx } = this.props;
    const { isSelected } = this.state;

    this.checkSelected();

    const selectedClass = [classes.personDataCard, classes.selected];

    return (
      <Card
        key={idx}
        title={
          <Title level={4}>
            <a onClick={this.nameClicked}>{personData.name} </a>
            <Button size="small" type="primary">
              未读
            </Button>
          </Title>
        }
        extra={
          <React.Fragment>
            <span style={{ display: 'inline-block', width: 70, height: 'auto', marginRight: 20 }}>
              <span
                style={{
                  borderRadius: '50%',
                  background: 'red',
                  position: 'absolute',
                  top: -8,
                  color: '#fafafa',
                  display: 'flex',
                  height: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  transform: 'rotate(20deg)',
                  fontWeight: 'bold',
                }}
              >
                强烈推荐
              </span>
            </span>
              <Text style={{ marginRight: 20 }}>{personData.recommend_person}</Text>
              <Text>推荐时间: {personData.recommend_time}</Text>
          </React.Fragment>
        }
        // style={{ border: '2px solid #2979ff', marginBottom: 15, overflow: 'hidden' }}
        className={isSelected ? selectedClass : classes.personDataCard}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={<Button>基本信息</Button>} key="1">
            <Row>
              <Col md={5}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>邮箱:</Text>
                  <Text>{personData.email}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>当前所在地:</Text>
                  <Text>{personData.living_address}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>计算机水平:</Text>
                  <Text>{personData.computer_level}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>当前薪资:</Text>
                  <Text>{personData.work_salary}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    当前离职
                    <br />
                    /在职状态:
                  </Text>
                  <Text>{personData.expect_jstatus}</Text>
                </p>
              </Col>
              <Col md={5}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>电话:</Text>
                  <Text>{personData.phone}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>户口所在地:</Text>
                  <Text>{personData.hukou_address}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>当前职位:</Text>
                  <Text>{personData.work_position}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>工作地点:</Text>
                  <Text>{personData.work_location}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    期望工作
                    <br />
                    地址:
                  </Text>
                  <Text>{personData.expect_jlocation}</Text>
                </p>
              </Col>
              <Col md={5}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>性别:</Text>
                  {/* <Text>{(personData[idx]==1) ? '男' : '女' }</Text> */}
                  <Text>{personData.gender === 1 ? '男' : '女'}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>身份证号:</Text>
                  <Text>{personData.id_card}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>当前单位:</Text>
                  <Text>{personData.work_company}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>期望薪资:</Text>
                  <Text>{personData.expect_salary}</Text>
                </p>
              </Col>
              <Col md={5}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>年龄:</Text>
                  <Text>{personData.age}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>民族:</Text>
                  <Text>{personData.race}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>所处行业:</Text>
                  <Text>{personData.work_industry}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>期望行业:</Text>
                  <Text>{personData.expect_industry}</Text>
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>出生时间:</Text>
                  <Text>{personData.birthday}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>英语水平:</Text>
                  <Text>{personData.english_level}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>在职状态:</Text>
                  <Text>{personData.work_status}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>到岗时间:</Text>
                  <Text>{personData.expect_time}</Text>
                </p>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Button block>笔面试信息</Button>} key="2">
            <Row>
              <Col md={5}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>姓名:</Text>
                  <Text>{personData.name}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>单选题得分:</Text>
                  <Text>{personData.single_choice_score}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    笔试成绩
                    <br />
                    排名:
                  </Text>
                  <Text>{personData.written_rank}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    面试成绩
                    <br />
                    排名:
                  </Text>
                  <Text>{personData.interview_rank}</Text>
                </p>
              </Col>
              <Col md={5}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>邮箱:</Text>
                  <Text>{personData.email}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>应用题得分:</Text>
                  <Text>{personData.problem_score}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>面试成绩:</Text>
                  <Text>{personData.interview_score}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>面试时长:</Text>
                  <Text>{personData.interview_time}</Text>
                </p>
              </Col>
              <Col md={5}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>推荐时间:</Text>
                  <Text>{personData.recommend_time}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    设计与应用
                    <br />
                    题得分:
                  </Text>
                  <Text>{personData.design_problem_score}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>面试题目数:</Text>
                  <Text>{personData.interview_num}</Text>
                </p>
              </Col>
              <Col md={5}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>笔试成绩:</Text>
                  <Text>{personData.written_score}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    笔试题答
                    <br />
                    卷时长:
                  </Text>
                  <Text>{personData.written_time}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    面试技术题
                    <br />
                    得分:
                  </Text>
                  <Text>{personData.interview_skill_score}</Text>
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>笔试答题数:</Text>
                  <Text>{personData.written_num}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    笔试答卷
                    <br />
                    切换次数:
                  </Text>
                  <Text>{personData.written_cut_num}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    面试素质题
                    <br />
                    得分:
                  </Text>
                  <Text>{personData.interview_quality_score}</Text>
                </p>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Button block>教育经历</Button>} key="3">
            <Row>
              <Col md={6}>
                {/* <p>
                  <Text style={{ marginRight: 20 }}>开始时间:</Text>
                  <Text>{personData.education_start}</Text>
                </p> */}
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>开始时间:</Text>
                  <Text>{personData.education_start}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>gpa 成绩:</Text>
                  <Text>{personData.edu_gpa}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>结束时间:</Text>
                  <Text>{personData.education_end}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>所学专业:</Text>
                  <Text>{personData.education_major}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>学历:</Text>
                  <Text>{personData.education_degree}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>是否统招:</Text>
                  <Text>{personData.edu_recruit}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>毕业学校:</Text>
                  <Text>{personData.education_school}</Text>
                </p>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Button block>工作经历</Button>} key="4">
            <Row>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>开始时间:</Text>
                  <Text>{personData.start_date}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>公司描述:</Text>
                  <Text>{personData.company_desc}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>公司性质:</Text>
                  <Text>{personData.company_nature}}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>持续时间:</Text>
                  <Text>{personData.duaration}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>结束时间:</Text>
                  <Text>{personData.end_date}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>行业:</Text>
                  <Text>{personData.industry}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>下属人数:</Text>
                  <Text>{personData.staff}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>工作能力:</Text>
                  <Text>{personData.capacity}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>公司名称:</Text>
                  <Text>{personData.company_name}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>职位:</Text>
                  <Text>{personData.position}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>汇报对象:</Text>
                  <Text>{personData.report_to}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>工作内容:</Text>
                  <Text>{personData.content}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>公司规模:</Text>
                  <Text>{personData.company_size}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>所在部门:</Text>
                  <Text>{personData.dept}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>离职原因:</Text>
                  <Text>{personData.why_leave}</Text>
                </p>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Button block>项目经历</Button>} key="5">
            <Row>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>开始时间:</Text>
                  <Text>{personData.pro_start_date}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>担任职位:</Text>
                  <Text>{personData.pro_position}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>结束时间:</Text>
                  <Text>{personData.pro_end_date}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>项目内容:</Text>
                  <Text>{personData.pro_content}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>项目名称:</Text>
                  <Text>{personData.pro_name}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>项目职责:</Text>
                  <Text>{personData.pro_resp}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>公司名称:</Text>
                  <Text>{personData.pro_company_name}</Text>
                </p>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Button block>技能信息</Button>} key="6">
            <Row>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>技能名称:</Text>
                  <Text>{personData.skill_name}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>熟练程度:</Text>
                  <Text>{personData.skill_level}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>
                    技能使用
                    <br />
                    时间:
                  </Text>
                  <Text>{personData.skill_time}</Text>
                </p>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Button block>语言技能</Button>} key="7">
            <Row>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>语言名称:</Text>
                  <Text>{personData.lang_name}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>语言:</Text>
                  <Text>{personData.lang}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>熟练程度:</Text>
                  <Text>{personData.lang_level}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>证书名称:</Text>
                  <Text>{personData.langcert_name}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>读写能力:</Text>
                  <Text>{personData.lang_read_write}</Text>
                </p>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>成绩:</Text>
                  <Text>{personData.langcert_score}</Text>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <Text style={{ marginRight: 5, width: '25%' }}>听说能力:</Text>
                  <Text>{personData.lang_listen_speak}</Text>
                </p>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}

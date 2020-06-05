import React, { Fragment, PureComponent } from 'react';
import { Modal, Button, Card, Row, Col, Typography } from 'antd';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';
import { StatisticsBarChart } from '@/components/Charts';

const { Title, Text } = Typography;

class StatisticsModal extends PureComponent {
  state = {
    visible: false,
    
    averageInterviewTimewWeeklyData: [
      {
        week: '第－周',
        笔试成绩平均分: 50,
        面试成绩平均分: 30,
      },
      {
        week: '第二周',
        笔试成绩平均分: 65,
        面试成绩平均分: 40,
      },
      {
        week: '第三周',
        笔试成绩平均分: 68,
        面试成绩平均分: 43,
      },
      {
        week: '第四周',
        笔试成绩平均分: 54,
        面试成绩平均分: 41,
      },
      {
        week: '第五周',
        笔试成绩平均分: 52,
        面试成绩平均分: 32,
      },
      {
        week: '第六周',
        笔试成绩平均分: 81,
        面试成绩平均分: 20,
      },
      {
        week: '第七周',
        笔试成绩平均分: 75,
        面试成绩平均分: 20,
      },
    ],
  };

  // cobra-55555 -20-04-20
  componentWillMount = () => {
    this.initComponent(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    this.initComponent(nextProps);
  }

  initComponent = (props) => {
    const { statistics_data } = props;
    this.setState({interviewWeeklyData: statistics_data.interviewWeeklyData, attendenceWeeklyData: statistics_data.attendenceWeeklyData});
  }
  // // // // //

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;

    const { statistics_data } = this.props;

    if(typeof statistics_data.interviewWeeklyData === 'undefined') {
      return (<></>);
    }

    return (
      <Fragment>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          数据汇总
        </Button>
        <Modal
          visible={visible}
          title="数据汇总"
          footer={null}
          width={700}
          onCancel={() => this.handleCancel()}
        >
          <Card size="small" style={{ border: '2px solid #2979ff' }}>
            <Row>
              <Col md={6} style={{ borderRight: '2px solid #2979ff' }}>
                <div style={{ textAlign: 'center' }}>
                  <Title
                    level={2}
                    style={{ marginTop: 0, marginBottom: 0, color: '#2979ff', fontWeight: 'bold' }}
                  >
                    <Text style={{ fontSize: 15, marginRight: 10 }}>累积笔试人数</Text>50
                  </Title>
                  <Title
                    level={2}
                    style={{ marginTop: 10, marginBottom: 0, color: '#2979ff', fontWeight: 'bold' }}
                  >
                    <Text style={{ fontSize: 15, marginRight: 10 }}>累积面试人数</Text>50
                  </Title>
                </div>
              </Col>
              <Col md={6} style={{ borderRight: '2px solid #2979ff' }}>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ color: '#2979ff' }}>较上周+6分</Text>
                  <Title
                    level={2}
                    style={{ marginTop: 5, marginBottom: 5, color: '#2979ff', fontWeight: 'bold' }}
                  >
                    50
                  </Title>
                  <Text>笔试平均分</Text>
                </div>
              </Col>
              <Col md={6} style={{ borderRight: '2px solid #2979ff' }}>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ color: '#2979ff' }}>较上周+6分</Text>
                  <Title
                    level={2}
                    style={{ marginTop: 5, marginBottom: 5, color: '#2979ff', fontWeight: 'bold' }}
                  >
                    50
                  </Title>
                  <Text>面试平均分</Text>
                </div>
              </Col>
              <Col md={6}>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ color: '#2979ff' }}>较上周+6分</Text>
                  <Title
                    level={2}
                    style={{ marginTop: 0, marginBottom: 0, color: '#2979ff', fontWeight: 'bold' }}
                  >
                    100
                  </Title>
                  <Text>总成绩平均分</Text>
                </div>
              </Col>
            </Row>
          </Card>
          <Card size="small" style={{ marginTop: 15, border: '2px solid #2979ff' }}>
            <AsyncLoadBizCharts>
              <StatisticsBarChart
                title="每周人员笔面试评价成绩统计"
                data={this.state.interviewWeeklyData}
                items={['笔试成绩平均分', '面试成绩平均分']}
                height={300}
              />
            </AsyncLoadBizCharts>
          </Card>
          <Card size="small" style={{ marginTop: 15, border: '2px solid #2979ff' }}>
            <AsyncLoadBizCharts>
              <StatisticsBarChart
                title="每周累积参加笔面试人员统计"
                data={this.state.attendenceWeeklyData}
                items={['累积参加笔试人数', '累积参加面试人数']}
                height={300}
              />
            </AsyncLoadBizCharts>
          </Card>
          <Card size="small" style={{ marginTop: 15, border: '2px solid #2979ff' }}>
            <AsyncLoadBizCharts>
              <StatisticsBarChart
                title="笔面试流程平均用时"
                data={this.state.averageInterviewTimewWeeklyData}
                items={['笔试成绩平均分', '面试成绩平均分']}
                options={['按周', '按⽇']}
                height={300}
              />
            </AsyncLoadBizCharts>
          </Card>
        </Modal>
      </Fragment>
    );
  }
}

export default StatisticsModal;

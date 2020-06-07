import React from 'react'
import { Card, Pagination, Row, Col, Typography, Dropdown, Menu } from 'antd'
import FaceIcon from '@material-ui/icons/Face';
import classes from './RequirementDetail.less';

const { Title, Text } = Typography;
export default class MonitoringTable extends React.PureComponent {
  state = {
    currentPage: 1,
    perPageNums: 5,
    currentTableData: []
  }

  componentWillMount = () => {
    this.initTable(this.props);
  }

  componentWillReceiveProps = (nextprops) => {
    this.initTable(nextprops);
  }

  initTable = (props) => {
    const { tableData } = props;
    this.setState((state) => {
      return {
        currentTableData: tableData.filter((data, idx) => idx >= (state.currentPage - 1) * state.perPageNums && idx < state.currentPage * state.perPageNums)
      }
    })
  }

  paginationChange = (page) => {
    this.setState({
      currentPage: page
    });
    this.initTable();
  }

  render() {
    const { title, tableData } = this.props;
    const { currentPage, perPageNums, currentTableData } = this.state;

    const { numData } = this.props;


    const emptylines = []
    if (currentTableData.length < 5) {
      for (var i = 0; i < (5 - currentTableData.length); i++) {
        // emptylines.push(<tr key={i}>&nbsp;</tr>);
        emptylines.push(<tr key={i}></tr>);
      }
    }

    return (
      <Card
        style={{ border: '2px solid #2979ff', marginBottom: 20 }}
        title={title}
        headStyle={{ backgroundColor: '#2979ff', color: '#fafafa' }}
        size="small"
        extra={
          <Pagination
            simple
            current={currentPage}
            total={tableData.length}
            pageSize={perPageNums}
            onChange={(page) => this.paginationChange(page)}
          />
        }
      >
        <Row>
          <Col md={5}>
            <div style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 10 }}>
              <Title
                level={1}
                style={{ marginBottom: 5, color: '#ff2525', fontWeight: 'bold' }}
              > {numData.online}
              </Title>
              <Text>在线人员</Text>
            </div>
            <div style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 10 }}>
              <Title
                level={1}
                style={{ marginBottom: 5, color: '#2979ff', fontWeight: 'bold' }}
              > {numData.total}
              </Title>
              <Text>全部人员</Text>
            </div>
          </Col>
          <Col md={19}>
            <table style={{ width: '100%', minHeight: 190 }}>
              <tbody>
                {currentTableData.map((trData, idx1) => (
                  <tr key={idx1}>
                    {trData.map((tdData, idx2) => (
                      <td key={idx2}
                        style={{ padding: '7px 2px' }}
                      >
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item>查看人员监控画面</Menu.Item>
                              <Menu.Item>查看答题情况</Menu.Item>
                            </Menu>
                          }
                          trigger={['click']}>
                          <Text style={{ color: tdData.online ? '#ff2525' : '#2979ff', cursor: 'pointer' }}><FaceIcon style={{ verticalAlign: 'middle' }} /> {tdData.name}</Text>
                        </Dropdown>
                      </td>
                    ))
                    }
                  </tr>
                ))}

                {currentTableData.length < 5 ?
                  emptylines
                  :
                  <></>
                }
              </tbody>
            </table>
          </Col>
        </Row>
      </Card>
    )
  }
}
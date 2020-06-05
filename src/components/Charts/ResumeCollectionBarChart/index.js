import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts'
import { Typography, Button } from 'antd'

const { Title, Text } = Typography

class ResumeCollectionBarChart extends Component {
  state = {
    autoHideXLabels: false
  }

  render() {
    const {
      height, 
      title, 
      forceFit = true,
      data, 
      color = 'rgba(24, 144, 255, 0.85)',
      btnText = '查看日统计',
      padding,
      actionBtn,
    } = this.props;
    const { autoHideXLabels } = this.state;
    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y
      })
    ];

    return (
      <div style={{height}} ref="chart_container">
        {title && <Title level={4}><Text>{title}</Text><Button size="small" onClick={() => actionBtn()} style={{float: 'right'}}>{btnText}</Button></Title>}
        <Chart 
          scale=""
          height={title ? height - 40 : height}
          forceFit={forceFit}
          data={data}
          padding={padding || ['auto', 60, 45, 'auto']}
        >
          <Axis 
            name="x"
            title
            label={autoHideXLabels ? false : {}}
            tickLine={autoHideXLabels ? false : {}}
          />
          <Axis name="y" min={0} position="left" />
          <Tooltip showTitle={false} crosshairs={false} />
          <Geom type="interval" position="x*y" color={color} tooltip={tooltip}/>
        </Chart>
      </div>
    )
  }
}
export default ResumeCollectionBarChart;
import React from 'react';
import { Chart, Axis, Tooltip, Geom, Legend, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import { Typography, Select } from 'antd';
const { Option } = Select;

class StatisticsBarChart extends React.Component {
  render() {
    const { Title } = Typography;
    const { height, data, items, title, options = null } = this.props;
    const ds = new DataSet();
    ds.setState('type', '');
    const dv = ds
      .createView()
      .source(data)
      .transform({
        type: 'fold',
        fields: items,
        key: 'type',
        value: 'value',
      });
    const colors = ['#2b6cbb', '#54ca76'];
    const legendItems = [];
    items.forEach((item, idx) => {
      legendItems.push({
        value: item,
        marker: { symbol: 'square', fill: colors[idx], radius: 5 },
      });
    });
    return (
      <div style={{ height }}>
        {title && (
          <Title level={4}>
            {title}
            {options ? (
              <Select defaultValue={options[0]} style={{ float: 'right' }}>
                {options.map((option, idx) => (
                  <Option value={option} key={idx}>
                    {option}
                  </Option>
                ))}
              </Select>
            ) : (
              <></>
            )}
          </Title>
        )}
        <Chart height={title ? height - 40 : height} forceFit data={dv} padding="auto">
          <Legend custom items={legendItems} />
          <Axis name="value" position={'left'} />
          <Tooltip />
          <Geom
            type="interval"
            position="week*value"
            color={[
              'type',
              value => {
                if (value === items[0]) {
                  return colors[0];
                }
                if (value === items[1]) {
                  return colors[1];
                }
              },
            ]}
            adjust={[
              {
                type: 'dodge',
                marginRatio: 1 / 32,
              },
            ]}
          />
        </Chart>
      </div>
    );
  }
}

export default StatisticsBarChart;

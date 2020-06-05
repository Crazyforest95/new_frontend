import React, {PureComponent} from 'react'
import { Card, Typography } from 'antd';
import * as d3 from 'd3'

const { Title } = Typography;

export default class HierchicalPieChart extends PureComponent {
    state = {
        width: 0
    }

    // cobra-55555 -20-04-19
    componentWillMount = () => {
        const { count_tracks } = this.props;
        this.setState({chartData: [
            [{
            value: 1, label: count_tracks[3].total, color: '#a6d45b', content: '需求满足数', today: '今日新增+' + count_tracks[3].today, total: '本周新增+1'
            }], 
            [{
            value: 1, label: count_tracks[2].total, color: '#ffd960', content: '面试完成数', today: '今日新增+' + count_tracks[2].today, total: '本周新增+20'
            }], 
            [{
            value: 1, label: count_tracks[1].total, color: '#9bd8c8', content: '笔试通过数', today: '今日新增+' + count_tracks[1].today, total: '本周新增+20'
            }], 
            [{
            value: 1, label: count_tracks[0].total, color: '#fd7080', content: '收集简历数', today: '今日新增+' + count_tracks[0].today, total: '本周新增+20'
            }]
        ]}, this.initChart);
        window.addEventListener("resize", this.scaleChart);
    }

    componentWillReceiveProps = (nextProps) => {
        const { count_tracks } = nextProps;

        this.setState({chartData: [
            [{
            value: 1, label: count_tracks[3].total, color: '#a6d45b', content: '需求满足数', today: '今日新增+' + count_tracks[3].today, total: '本周新增+1'
            }], 
            [{
            value: 1, label: count_tracks[2].total, color: '#ffd960', content: '面试完成数', today: '今日新增+' + count_tracks[2].today, total: '本周新增+20'
            }], 
            [{
            value: 1, label: count_tracks[1].total, color: '#9bd8c8', content: '笔试通过数', today: '今日新增+' + count_tracks[1].today, total: '本周新增+20'
            }], 
            [{
            value: 1, label: count_tracks[0].total, color: '#fd7080', content: '收集简历数', today: '今日新增+' + count_tracks[0].today, total: '本周新增+20'
            }]
        ]}, this.initChart);

        window.addEventListener("resize", this.scaleChart);
    }
    // // // // //

    // cobra-55555 -20-04-19
    initChart = () => {
        const { chartData } = this.state;

        let container = this.refs.hierachical_pie_chart;
        let width = 420;
        let height = 350;
        let radius = height;
        let angle = 20;
        let startAngle = -(Math.PI * angle / 180);
        let endAngle = Math.PI * angle / 180;
        this.setState({
            width: width
        });
        let content = d3.select(this.refs.hierachical_pie_chart);

        // important clear old graph
        content.select('svg').remove();

        content = content.append("svg")
            .attr("width", width)
            .attr("height", height);
        content = content.append("g").attr("transform", `translate(${Math.sin(endAngle) * height}, ${height -20})`);
        let pieWidth = parseFloat(radius / chartData.length) - chartData.length;
        chartData.forEach((data, idx) => {
            let pie = d3.pie()
                .sort(null)
                .value(d => {
                    return d.value;
                })
                .startAngle(startAngle)
                .endAngle(endAngle)
            let arc = d3.arc()
                .outerRadius((idx + 1) * pieWidth - 10)
                .innerRadius(idx * pieWidth);
            
            let group = content.selectAll(".arc" + idx)
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc" + idx)
            group.append("path").attr("d", arc)
                .attr("fill", d => {
                    return d.data.color;
                });
            let line = d3.line();
            group.append("path")
                .attr("transform", d => {
                    return `translate(${arc.centroid(d)})`;
                })
                .attr("d", line([[0,0], [radius/2, 0]]))
                .attr("stroke-width", 5)
                .attr("stroke", d => {
                    return d.data.color;
                });
            group.append("circle").attr("transform", (d) => {
                return "translate(" + arc.centroid(d) + ")";
                })
                .attr("r", 10)
                .attr("cx", radius / 2 - 2.5)
                .attr("cy", 0)
                .attr("fill", (d) => {
                    return d.data.color;
                });
            let rectGroup = group.append("g")
                .attr("transform", d => {
                    let centroid = arc.centroid(d);
                    return `translate(${centroid[0] + radius/2 + 30}, ${centroid[1] - 12})`
                });
            rectGroup.append("rect")
                .attr("width", 90)
                .attr("height", 24)
                .attr("fill", (d) => {
                    return d.data.color;
                });
            rectGroup.append("text")
                .attr("transform", "translate(45, 12)")
                .attr("fill", "#fafafa")
                .attr("text-anchor", "middle")
                .attr("dy", ".35rem")
                .text((d) => {
                  return d.data.content;
                });
        
            let textGroup = rectGroup.append("text")
                .attr("transform", "translate(5, 25)")
                .attr("font-size", 12);
        
            textGroup.append("tspan")
                .text((d) => {
                  return d.data.today
                })
                .attr("x", 0)
                .attr("dy", "1.2em");
            textGroup.append("tspan")
                .text((d) => {
                  return d.data.total
                })
                .attr("x", 0)
                .attr("dy", "1.2em");
        
            group.append("text").attr("transform", (d) => {
                return "translate(" + arc.centroid(d) + ")";
              })
                .attr("x", radius /2 - 38)
                .attr("y", -18)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("fill", (d) => {
                  return d.data.color;
                })
                .attr("font-size", 25)
                .attr("font-weight", "bold")
                .text((d) => {
                  return d.data.label;
                });
        });
    }
    // // // // //

    render() {
        const { title } = this.props;

        return (
          <Card
            style={{marginBottom: 20, border: '2px solid #2979ff', textAlign: 'center'}}
            size="small"
          >
            <Title level={4}>{title ? title : ""}</Title>
            <div ref="hierachical_pie_chart" style={{overflowX: 'auto'}} />
          </Card>
        )
    }
}
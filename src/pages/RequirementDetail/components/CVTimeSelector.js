import React from 'react';
// import PropTypes from "prop-types";
import styled from 'styled-components';
import dayjs from 'dayjs';

const Wrap = styled.div``;

const Upper = styled.div`
  background-color: #ffffff;

  .title {
    text-align: center;
    padding: 0.6rem 0;
    border-bottom: solid 0.5px #e7e7e7;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
`;

const Block = styled.div`
  background-color: ${p => p.bgColor || 'white'};
  height: 3vw;
  width: ${p => p.width || '3vw'};

  display: flex;
  justify-content: center;
  align-items: center;

  border-bottom: solid 0.5px #e7e7e7;
`;

function CVTimeSelector({ data, onChange }) {
  // 序列化数据
  const normalizedData = data.reduce((pre, cur) => {
    const nowPre = pre;
    nowPre[cur.date] = cur;
    return nowPre;
  }, {});

  const now = new Date();
  const zh = ['一', '二', '三', '四', '五', '六', '日'];

  // 1确定这周第一天
  const firstDay = new Date();
  firstDay.setDate(firstDay.getDate() + 1 - now.getDay());
  const dateTmp = new Date(firstDay);
  // 2渲染两周
  const weekArr = [];
  for (let i = 0; i < 2; i += 1) {
    const arr = [];
    for (let j = 0; j < 7; j += 1) {
      const date = new Date(dateTmp);
      const dateStr = dayjs(date.getTime()).format('YYYY-MM-DD');
      // 组合data数据
      arr.push(
        Object.assign(
          {},
          {
            disable: date.getTime() <= now.getTime(),
            zh: zh[j],
            date: dateStr,
          },
          normalizedData[dateStr]
        )
      );
      dateTmp.setDate(dateTmp.getDate() + 1);
    }
    weekArr.push(arr);
  }

  function renderCol(item) {
    return (
      <div key={item.date}>
        <Block>{item.zh}</Block>
        {item.disable ? (
          <>
            <Block bgColor="#dedede" />
            <Block bgColor="#dedede" />
            <Block bgColor="#dedede" />
          </>
        ) : (
          <>
            {['am', 'pmA', 'pmB'].map(t => {
              return (
                <Block
                  key={t}
                  bgColor={item[t] ? '#0084fe' : '#f0f2f7'}
                  onClick={() => {
                    onChange(Object.assign({}, item, { [t]: !item[t] }));
                  }}
                />
              );
            })}
          </>
        )}
      </div>
    );
  }

  return (
    <Wrap>
      <Upper>
        <p className="title">请标记出可面试的时间</p>
        <div className="row">
          <div style={{ flex: 1 }}>
            <Block width="100%">本周</Block>
            <Block width="100%">10~12点</Block>
            <Block width="100%">14~16点</Block>
            <Block width="100%">16~18点</Block>
          </div>
          {weekArr[0].map(item => {
            return renderCol(item);
          })}
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <Block width="100%">下周</Block>
            <Block width="100%">10~12点</Block>
            <Block width="100%">14~16点</Block>
            <Block width="100%">16~18点</Block>
          </div>
          {weekArr[1].map(item => {
            return renderCol(item);
          })}
        </div>
      </Upper>
    </Wrap>
  );
}

// CVTimeSelector.propTypes = {
//   onChange: PropTypes.func,
//   data: PropTypes.array,
//   onConfirm: PropTypes.func,
//   onCancel: PropTypes.func
// };

export default CVTimeSelector;

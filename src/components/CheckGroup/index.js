import React from 'react';

import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

class CheckGroup extends React.Component {
  onChange = checkedList => {
    const { onChange } = this.props;
    onChange(checkedList);
  };

  onCheckAllChange = e => {
    const { onChange, level } = this.props;
    const levelArr = level.map(i => i.id);

    onChange(e.target.checked ? levelArr : []);
  };

  render() {
    const { value, level, way } = this.props;
    return (
      <div>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={value && value.length < level.length && value.length > 0}
            onChange={this.onCheckAllChange}
            checked={value && value.length}
          >
            全选
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup value={value} onChange={this.onChange}>
          {level.map(i => (
            <>
              <Checkbox key={i.id} value={i.id}>
                {i.name}
              </Checkbox>
              <span>
                {i.money} 元/{way}
              </span>
              <br />
            </>
          ))}
        </CheckboxGroup>
      </div>
    );
  }
}

export default CheckGroup;

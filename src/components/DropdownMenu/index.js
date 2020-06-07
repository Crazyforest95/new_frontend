import React, { PureComponent } from 'react';
import { Dropdown, Icon, Menu } from 'antd';
import PropTypes from 'prop-types';

class DropdownMenu extends PureComponent {
  menu = menuList => {
    return (
      <Menu>
        {menuList.map((item, i) => (
          <Menu.Item key={i}>{item}</Menu.Item>
        ))}
      </Menu>
    );
  };

  render() {
    const { menuList, icon } = this.props;

    return (
      <Dropdown overlay={this.menu(menuList)}>
        <Icon type={icon} />
      </Dropdown>
    );
  }
}

DropdownMenu.defaultProps = {
  menuList: [],
  icon: 'ellipsis',
};

DropdownMenu.propTypes = {
  menuList: PropTypes.array,
  icon: PropTypes.string,
};

export default DropdownMenu;

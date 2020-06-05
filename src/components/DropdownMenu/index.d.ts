import * as React from 'react';
export interface IDropdownMenuProps {
  menuList: Array<React.ReactNode>;
  icon?: string;
}

export default class DropdownMenu extends React.PureComponent<IDropdownMenuProps, any> {}

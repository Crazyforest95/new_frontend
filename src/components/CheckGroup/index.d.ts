import * as React from 'react';
export interface ICheckGroupProps {
  level: Array<{
    id: number;
    name: string;
    money: number;
  }>;
  value: object[];
  way: string;
  onChange: (value: Array<number>) => void;
  style?: React.CSSProperties;
}

export default class CheckGroup extends React.Component<ICheckGroupProps, any> {}

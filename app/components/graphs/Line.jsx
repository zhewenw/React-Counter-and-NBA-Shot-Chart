import React, { Component } from 'react';
import styles from './Line.scss';
import selector from './line-selector';

const { number, string } = React.PropTypes;

export default class Line extends Component {
  static propTypes = {
    x: number,
    transition: string,
  };

  render() {
    const { height, left, top, angle } = selector(this.props);
    const { transition } = this.props;
    const transformConstant = `perspective(500px) rotate(${angle}deg)`;
    const transformVariable = transition === 'up' ?
      'translateZ(1000px)' :
      'translateZ(0px)';
    const lineStyle = {
      transform: `${transformConstant} ${transformVariable}`,
      height: `${height}%`,
      left: `${left}%`,
      top: `${top}%`
    };

    return <div className={styles.line} style={lineStyle} />;
  }
}

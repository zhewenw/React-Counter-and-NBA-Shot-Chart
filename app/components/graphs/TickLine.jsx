import React, { Component } from 'react';
import styles from './Line.scss';

const { number, string } = React.PropTypes;

export default class TickLine extends Component {
  static propTypes = {
    x: number,
    transition: string,
  };

  render() {
    const { x, transition } = this.props;
    const transformConstant = 'perspective(500px)';
    const transformVariable = transition === 'up' ?
      'translateZ(1000px)' :
      'translateZ(0px)';
    const transform = `${transformConstant} ${transformVariable}`;
    const lineStyle = { transform, left: `${x}%` };

    return <div className={styles.tickline} style={lineStyle} />;
  }
}

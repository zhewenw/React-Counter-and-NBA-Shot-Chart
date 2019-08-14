import React, { Component } from 'react';
import styles from './Line.scss';

const { number, string } = React.PropTypes;

export default class VerticalLine extends Component {
  static propTypes = {
    x: number,
    x2: number,
    transition: string,
    color: string,
  };

  render() {
    const { x, x2, transition, color, } = this.props;
    const transformConstant = 'perspective(500px)';
    const transformVariable = transition === 'up' ?
      'translateZ(1000px)' :
      'translateZ(0px)';
    const transform = `${transformConstant} ${transformVariable}`;
    const lineStyle = { transform, left: `${x}%`, };
    const lineStyle2 = { transform, left: `${x2}%` };
    const lineColor = color;

    if (lineColor === 'red') {
      return <div className={styles.verticalMeanline} style={lineStyle} />;
    }
    if (lineColor === 'green') {
      return <div className={styles.verticalMedianline} style={lineStyle} />;
    }
    if (lineColor === 'blue') {
      return <div className={styles.verticalModeline} style={lineStyle} />;
    }
    if (lineColor === 'orange') {
      return (
        <div>
          <div className={styles.verticalQuartileline} style={lineStyle} />
          <div className={styles.verticalQuartileline} style={lineStyle2} />
        </div>
        );
    }
  }
}

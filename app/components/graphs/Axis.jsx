import React, { Component } from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import classNames from 'classnames';

import styles from './Axis.scss';
import Tick from './Tick.jsx';

const { number, string, func } = React.PropTypes;

export default class Axis extends Component {
  static propTypes = {
    ticks: number,
    dir: string,
    scale: func
  };

  static defaultProps = {
    ticks: 10,
    dir: 'vertical'
  };

  ticks() {
    const { ticks, scale } = this.props;
    const ticksArr = scale.ticks(ticks);
    const tickJsxs = ticksArr.map((t, i) => <Tick key={i}>{t}</Tick>);

    const firstTick = scale(ticksArr[0]);
    const lastIdx = ticksArr.length - 1;
    const relativeSize = scale(ticksArr[lastIdx]) - firstTick;
    const offsetAttName = (this.props.dir === 'vertical') ? 'bottom' : 'left';
    const sizeAttName = (this.props.dir === 'vertical') ? 'height' : 'width';
    const ticksStyle = {
      [sizeAttName]: `${relativeSize}%`,
      [offsetAttName]: `${firstTick}%`
    };

    return { ticksStyle, tickJsxs };
  }

  render() {
    const { dir } = this.props;
    const dirClass = (dir === 'vertical') ? styles.vertical : styles.horizontal;

    const klass = classNames(dirClass);
    const { ticksStyle, tickJsxs } = this.ticks();

    return (
      <div className={klass}>
        <VelocityTransitionGroup enter="slideDown" runOnMount>
          <div className={styles.line} />
        </VelocityTransitionGroup>

        <div className={styles.ticks} style={ticksStyle}>
          {tickJsxs}
        </div>
      </div>
    );
  }
}


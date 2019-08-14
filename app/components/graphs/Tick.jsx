import React, { Component } from 'react';
import { VelocityTransitionGroup } from 'velocity-react';

import styles from './Axis.scss';

const { node } = React.PropTypes;

export default class Tick extends Component {
  static propTypes = { children: node };

  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  // If the input is a float, then use only 2 sigfigs. Otherwise, leave it alone
  abridgeFloats(n) {
    return this.isFloat(n) ? n.toPrecision(2) : n;
  }

  render() {
    return (
      <div className={styles.tick}>
        <VelocityTransitionGroup enter="fadeIn" runOnMount>
          <span className={styles.label}>
            {this.abridgeFloats(this.props.children)}
          </span>
        </VelocityTransitionGroup>
      </div>
    );
  }
}


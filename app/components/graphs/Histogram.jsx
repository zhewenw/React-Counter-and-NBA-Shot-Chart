import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import selector from './histogram-selector';
import { shotSelector } from '../../reducers/store-selector.js';
import styles from './Plot.scss';
import Axis from './Axis';

function Bar(props) {
  const { height } = props;
  const style = { height: `${height}%` };
  return <div className={styles.bar} style={style} />;
}

Bar.propTypes = { height: PropTypes.number };

class Histogram extends Component {
  constructor() {
    super();
    this.cancelId = null;
    this.state = { transition: 'up' };
  }

  componentDidMount() {
    const go = () => this.setState({ transition: 'down' });
    this.cancelId = setTimeout(go, 1);
  }

  componentWillUnmount() {
    clearTimeout(this.cancelId);
  }

  renderBar(col, i) {
    return <Bar key={i} height={col} />;
  }

  render() {
    const { xScale, yScale, cols } = selector(this.props);
    const klass = classNames(styles.histogram, styles.main);

    return (
      <div className={klass}>
        <div className={styles.vertical}>
          <Axis dir="vertical" scale={yScale} />
        </div>
        <div className={styles.horizontal}>
          <Axis dir="horizontal" scale={xScale} />
        </div>
        <div className={styles.plot}>
          {cols.map(this.renderBar)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bins: state.get('dataReducer').bins,
    data: shotSelector(state),
    x: row => row.stats[state.get('dataReducer').xVal],
  };
}

export default connect(mapStateToProps)(Histogram);

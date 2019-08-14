import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Plot.scss';
import css from './Discrete.scss';
import Axis from './Axis';
import Point from './Point';
import VerticalLine from './VerticalLine';
import selector from './discrete-histogram-selector';
import statselector from './discrete-histogram-stats-selector';
import { shotSelector } from '../../reducers/store-selector.js';
import RankingsTable from '../RankingsTable';
import * as playPenActions from '../../actions/playpenActions';

import tableConstants from '../TableConstants';

class DiscreteHistogram extends Component {
  static propTypes = {
    signalDiscreteHistogramPointsAreRendered: PropTypes.func.isRequired,
    discreteHistogramPointsAreRendered: PropTypes.bool.isRequired,
    changeDHTableNum: PropTypes.func.isRequired,
    dhTableNum: PropTypes.number.isRequired,
  };

  constructor() {
    super();

    this.cancelId = null;
    this.state = {
      transition: 'up',
      displayMean: false,
      displayMedian: false,
      displayMode: false,
      displayFirstQuartile: false,
      displayThirdQuartile: false,
      xVal: null,
      meanVal: null,
      medianVal: null,
      modeVal: null,
      firstquartileVal: null,
      thirdquartileVal: null,
    };
  }

  componentDidMount() {
    const go = () => this.setState({ transition: 'down' });
    this.cancelId = setTimeout(go, 1);
  }

  componentWillUnmount() {
    clearTimeout(this.cancelId);
  }

  // changing the state and stating the xVal
  setVal(value, value2, type, event) {
    const e = event;
    if (event.target.style.opacity === '0.8' || event.target.style.opacity === '') {
      e.target.style.opacity = '0.4';
    } else {
      e.target.style.opacity = '0.8';
    }

    if (type === 'mean') {
      const toggleMean = !this.state.displayMean;
      this.setState({ displayMean: toggleMean, meanVal: value, color: 'red' });
    }
    if (type === 'median') {
      const toggleMedain = !this.state.displayMedian;
      this.setState({ displayMedian: toggleMedain, medianVal: value, color: 'green' });
    }
    if (type === 'mode') {
      const toggleMode = !this.state.displayMode;
      this.setState({ displayMode: toggleMode, modeVal: value, color: 'blue' });
    }
    if (type === 'outliers') {
      const toggleFirstQuartile = !this.state.displayFirstQuartile;
      const toggleThirdQuartile = !this.state.displayThirdQuartile;
      this.setState({
        displayFirstQuartile: toggleFirstQuartile,
        firstquartileVal: value,
        color: 'orange'
      });
      this.setState({
        displayThirdQuartile: toggleThirdQuartile,
        thirdquartileVal: value2,
        color: 'orange'
      });
    }
  }

  handleTableBackClick() {
    const currentTableNum = this.props.dhTableNum;
    this.props.changeDHTableNum(currentTableNum - 1);
  }

  handleTableForwardClick() {
    const currentTableNum = this.props.dhTableNum;
    this.props.changeDHTableNum(currentTableNum + 1);
  }

  handleLoadTableClick() {
    this.props.signalDiscreteHistogramPointsAreRendered();
  }

  // value is the raw xVal at which to draw the line. xScale changes x to a
  // percent value.
  renderLine(value, value2, xScale, color) {
    if (this.state.displayMean === true && color === 'red') {
      return (
        <VerticalLine
          x={xScale(value)}
          transition={this.state.transition}
          color={color}
        />);
    }
    if (this.state.displayMedian === true && color === 'green') {
      return (
        <VerticalLine
          x={xScale(value)}
          transition={this.state.transition}
          color={color}
        />);
    }
    if (this.state.displayMode === true && color === 'blue') {
      return (
        <VerticalLine
          x={xScale(value)}
          transition={this.state.transition}
          color={color}
        />);
    }
    if (this.state.displayFirstQuartile === true
      && this.state.displayThirdQuartile === true
      && color === 'orange') {
      return (
        <VerticalLine
          x={xScale(value)}
          x2={xScale(value2)}
          transition={this.state.transition}
          color={color}
        />);
    }
    return null;
  }

  renderPoint(position, i) {
    const id = position.row.id;
    const { x, y } = position;
    const params = { key: i, x, y, id };
    return <Point {...params} />;
  }

  render() {
    const { xScale, yScale, positions, minHeight, minWidth } = selector(this.props);
    const { mean, median, mode, firstQuart, thirdQuart } = statselector(this.props);
    const { numRows } = tableConstants;
    const style = { minHeight, minWidth };
    const { discreteHistogramPointsAreRendered, dhTableNum } = this.props;
    const tableBackDisabled = dhTableNum === 0;
    const tableForwardDisabled = (dhTableNum + 1) * numRows >= positions.length;
    const tableFirstRowNum = (dhTableNum * numRows) + 1;
    const tableLastRowNum = (dhTableNum + 1) * numRows;
    const tableAreaStyle = { paddingTop: '50px' };
    const rankingsTable = <RankingsTable positions={positions} tableNum={dhTableNum} />;

    const tableBackProps = {
      disabled: tableBackDisabled,
      onClick: this.handleTableBackClick.bind(this)
    };

    const tableForwardProps = {
      disabled: tableForwardDisabled,
      onClick: this.handleTableForwardClick.bind(this)
    };

    const setMean = this.setVal.bind(this, mean, null, 'mean');
    const setMedian = this.setVal.bind(this, median, null, 'median');
    const setMode = this.setVal.bind(this, mode, null, 'mode');
    const setQuartiles = this.setVal.bind(this, firstQuart, thirdQuart, 'outliers');

    return (
      <div>
        <div className={css.stats}>
          <button onClick={setMean} className={css.meanbtn}>Mean</button>
          <button onClick={setMedian} className={css.medianbtn}>Median</button>
          <button onClick={setMode} className={css.modebtn}>Mode</button>
          <button onClick={setQuartiles} className={css.quartbtn}>Quartiles</button>
        </div>
        <div className={styles.main} style={style}>
          <div className={styles.vertical}>
            <Axis dir="vertical" scale={yScale} />
          </div>
          <div className={styles.horizontal}>
            <Axis dir="horizontal" scale={xScale} />
          </div>
          <div className={styles.plot}>
            {positions.map(this.renderPoint)}
            {this.renderLine(this.state.medianVal, null, xScale, 'green')}
            {this.renderLine(this.state.meanVal, null, xScale, 'red')}
            {this.renderLine(this.state.modeVal, null, xScale, 'blue')}
            {this.renderLine(this.state.firstquartileVal,
              this.state.thirdquartileVal,
              xScale,
              'orange')}
          </div>
          <div className="tableArea" style={tableAreaStyle}>
            <div>
              <button onClick={this.handleLoadTableClick.bind(this)}>LoadTable
              </button>
            </div>
            <div>
              <button type="button" {...tableBackProps}> &lt; </button>
              <button type="button" {...tableForwardProps}> &gt; </button>
              <div> Current list: {tableFirstRowNum} - {tableLastRowNum} </div>
            </div>
            <div className="rankingsTableView">
              {discreteHistogramPointsAreRendered ? rankingsTable : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bins: state.get('dataReducer').bins,
    data: shotSelector(state),
    discreteHistogramPointsAreRendered: state.get('dataReducer').discreteHistogramPointsAreRendered,
    x: row => row.stats[state.get('dataReducer').xVal],
    dhTableNum: state.get('dataReducer').dhTableNum,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(playPenActions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DiscreteHistogram);

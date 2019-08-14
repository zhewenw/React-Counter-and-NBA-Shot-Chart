import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Plot.scss';
import buttonStyle from './Discrete.scss';
import Axis from './Axis';
import Line from './Line';
import Point from './Point';
import selector, { linearRegressionSelector } from './plot-selector';
import { shotSelector } from '../../reducers/store-selector';
import PlotTable from '../PlotTable';
import * as playPenActions from '../../actions/playpenActions';
import tableConstants from '../TableConstants';


class Plot extends Component {
  static propTypes = {
    signalPlotPointsAreRendered: PropTypes.func.isRequired,
    plotPointsAreRendered: PropTypes.bool.isRequired,
    plotTableNum: PropTypes.number.isRequired,
    changePlotTableNum: PropTypes.func.isRequired,
    xVal: PropTypes.number.isRequired,
    yVal: PropTypes.number.isRequired,
  };

  constructor() {
    super();

    this.cancelId = null;
    this.state = {
      transition: 'up',
      showRegression: false,
    };
  }

  componentDidMount() {
    const go = () => this.setState({ transition: 'down' });
    this.cancelId = setTimeout(go, 1);
  }

  componentWillUnmount() {
    clearTimeout(this.cancelId);
  }

  onShowLineClick() {
    const currentState = this.state.showRegression;
    this.setState({ showRegression: !currentState });
  }

  handleTableBackClick() {
    const currentTableNum = this.props.plotTableNum;
    this.props.changePlotTableNum(currentTableNum - 1);
  }

  handleTableForwardClick() {
    const currentTableNum = this.props.plotTableNum;
    this.props.changePlotTableNum(currentTableNum + 1);
  }

  handleLoadTableClick() {
    this.props.signalPlotPointsAreRendered();
  }

  renderLine(a, b) {
    if (!this.state.showRegression) {
      return null;
    }

    return <Line a={a} b={b} transition={this.state.transition} />;
  }

  render() {
    const { xScale, yScale, rows } = selector(this.props);
    const { xVal, yVal } = this.props;
    const { a, b } = linearRegressionSelector(this.props);
    const { numRows } = tableConstants;

    const { plotPointsAreRendered } = this.props;

    const points = rows.map((row, i) => {
      const props = {
        id: row.row.id,
        key: i,
        x: xScale(row.x),
        y: yScale(row.y),
      };

      return <Point {...props} />;
    });

    const buttonProps = {
      className: buttonStyle.btn,
      onClick: this.onShowLineClick.bind(this)
    };

    const tableBackDisabled = this.props.plotTableNum === 0;
    const tableForwardDisabled = (this.props.plotTableNum + 1) * numRows >= rows.length;
    const tableFirstRowNum = (this.props.plotTableNum * numRows) + 1;
    const tableLastRowNum = (this.props.plotTableNum + 1) * numRows;
    const tableAreaStyle = { paddingTop: '50px' };

    const tableBackProps = {
      disabled: tableBackDisabled,
      onClick: this.handleTableBackClick.bind(this)
    };

    const tableForwardProps = {
      disabled: tableForwardDisabled,
      onClick: this.handleTableForwardClick.bind(this)
    };

    const plotTable = (
      <PlotTable
        xVal={xVal}
        yVal={yVal}
        rows={rows}
        tableNum={this.props.plotTableNum}
      />);

    return (
      <div>
        <button {...buttonProps}>Best Fit</button>
        <div className={styles.main}>
          <div className={styles.vertical}>
            <Axis dir="vertical" scale={yScale} />
          </div>

          <div className={styles.horizontal}>
            <Axis dir="horizontal" scale={xScale} />
          </div>
          <div className={styles.plot}>
            {points}
          </div>
          {this.renderLine(a, b)}
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
          <div className="plotTableView">
            { plotPointsAreRendered ? plotTable : null}
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
    plotPointsAreRendered: state.get('dataReducer').plotPointsAreRendered,
    xVal: state.get('dataReducer').xVal,
    yVal: state.get('dataReducer').yVal,
    x: row => row.stats[state.get('dataReducer').xVal],
    y: row => row.stats[state.get('dataReducer').yVal],
    plotTableNum: state.get('dataReducer').plotTableNum,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(playPenActions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Plot);

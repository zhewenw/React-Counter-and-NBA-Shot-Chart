import { Link } from 'react-router';
import React, { Component, PropTypes } from 'react';
import Constants from '../constants';
import styles from './PlayPen.scss';

// For now, we assume a static list of specific stats
const statNames = Constants.statNames;
const graphTypes = Constants.graphTypes;
const actualGraphs = Constants.actualGraphs;

export default class PlayPen extends Component {
  static propTypes = {
    changeRankingsDataAction: PropTypes.func.isRequired,
    xVal: PropTypes.number.isRequired,
    yVal: PropTypes.number.isRequired,
    children: PropTypes.node,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    bins: PropTypes.number.isRequired,
    changeNumberOfBins: PropTypes.func.isRequired,
    minShots: PropTypes.number.isRequired,
    dataView: PropTypes.string.isRequired,
    changeMinShots: PropTypes.func.isRequired,
    initializePlayers: PropTypes.func.isRequired,
    initializeTeams: PropTypes.func.isRequired,
    toggleDataView: PropTypes.func.isRequired,
    signalLocationChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isGraph: true,
    };
  }

  componentDidMount() {
    this.props.initializePlayers();
    this.props.initializeTeams();
  }

  handleClick(xVal, yVal) {
    this.props.changeRankingsDataAction(xVal, yVal);
  }

  handleClass(graphType) {
    if (this.state.buttonType === graphType) {
      return styles.btnDisable;
    }
    return styles.btn;
  }

  changeLocation(graphType) {
    const isGraph = (actualGraphs.indexOf(graphType) !== -1);
    this.props.signalLocationChange();
    this.setState({ buttonType: graphType, isGraph });
  }

  camelCaseToWords(text) {
    const result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  renderUpdateGraphButton(graphType) {
    const klass = this.handleClass(graphType);
    const callback = this.changeLocation.bind(this, graphType);

    return (
      <Link to={`/${graphType}`} key={graphType}>
        <button type="button" className={klass} onClick={callback}>
          {this.camelCaseToWords(graphType)}
        </button>
      </Link>
    );
  }

  renderDataViewButton() {
    const { toggleDataView, dataView } = this.props;
    const nextView = dataView === 'player' ? 'team' : 'player';
    return (
      <center>
        <button onClick={toggleDataView.bind(this, nextView)}>
          To {nextView} View
        </button>
      </center>
    );
  }

  renderMinShotsSlider() {
    const inputProps = {
      type: 'range',
      min: 0,
      max: 300,
      step: 50,
      value: this.props.minShots,
      onChange: (event) => this.props.changeMinShots(Number(event.target.value)),
    };

    return (
      <div className={styles.bin}>
        <div>Minimum Shots: {this.props.minShots}</div>
        <input {...inputProps} />
      </div>
    );
  }

  renderNumBinsSlider() {
    if (this.props.location.pathname === '/discreteHistogram' ||
      this.props.location.pathname === '/histogram') {
      const inputProps = {
        type: 'range',
        min: 5,
        max: 100,
        step: 5,
        value: this.props.bins,
        onChange: (event) => this.props.changeNumberOfBins(Number(event.target.value)),
      };

      return (
        <div className={styles.bin}>
          <div>
            # of Bins: {this.props.bins}
          </div>
          <input {...inputProps} />
        </div>
      );
    }

    return null;
  }

  renderSelector(axis, xVal, yVal) {
    if (axis === 'y' && (this.props.location.pathname === '/histogram' ||
      this.props.location.pathname === '/discreteHistogram')) {
      return null;
    }

    const { changeRankingsDataAction } = this.props;
    let val;
    let onChange;
    if (axis === 'x') {
      val = xVal;
      onChange = ((event) => changeRankingsDataAction(Number(event.target.value), yVal));
    } else {
      val = yVal;
      onChange = ((event) => changeRankingsDataAction(xVal, Number(event.target.value)));
    }

    return (
      <div className={styles.select}>
        {`${axis.toUpperCase()}:`}
        <select onChange={onChange} value={val}>
          {statNames.map((name, index) =>
            <option value={index} key={index}>{name}</option>
          )}
        </select>
      </div>
    );
  }

  render() {
    const { xVal, yVal, children } = this.props;
    // the graphs have selectors which expects props to have data, x, and y as keys.
    const isGraph = this.state.isGraph;

    return (
      <div className={styles.outer}>
        <div className={styles.container}>
          <h1 className={styles.title}>Play Pen</h1>
          <div className={styles.home}>
            <Link className={styles.homeCON} to="/">Home</Link>
          </div>
          <div className={styles.dropdown}>
            {graphTypes.map(this.renderUpdateGraphButton.bind(this))}
          </div>
        </div>
        {isGraph ? this.renderDataViewButton() : null }
        <div className="currentXAndYVals">
          {isGraph ? this.renderSelector('x', xVal, yVal) : null }
          {isGraph ? this.renderSelector('y', xVal, yVal) : null }
        </div>
        {isGraph ? this.renderMinShotsSlider() : null }
        {isGraph ? this.renderNumBinsSlider() : null }
        <div className={styles.graph}>
          <table>
            <tbody>
              <tr>
                <td>
                  {children}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

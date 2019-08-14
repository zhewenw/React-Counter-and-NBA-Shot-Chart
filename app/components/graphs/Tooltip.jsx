import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './Point.scss';
import Constants from '../../constants';
import { rankSelector } from '../../reducers/store-selector.js';
import { getTeamId, getEntity } from '../../utils/entities.js';
import * as playPenActions from '../../actions/playpenActions.js';
import getPlayerHeadURL from '../../utils/player-head-util';

const oddTeamAbbreviations = Constants.oddTeamAbbreviations;

const statNames = Constants.statNames;

class Tooltip extends Component {
  static propTypes = {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    id: React.PropTypes.string,
    players: React.PropTypes.object,
    teams: React.PropTypes.object,
    ranks: React.PropTypes.object,
    xVal: React.PropTypes.number,
    toggleSelected: React.PropTypes.func,
    nbaId: React.PropTypes.string,
  };

  getTeamId(id) {
    return getTeamId(this.props.players, this.props.teams, id);
  }

  getTeamLogo(tid) {
    const rawAbbreviation = this.props.teams[tid].abbreviation;
    const teamAbbreviation = rawAbbreviation in oddTeamAbbreviations ?
      oddTeamAbbreviations[rawAbbreviation] :
      rawAbbreviation;

    const url = `http://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${teamAbbreviation}.png&h=150&w=150`;

    return <img src={url} alt={rawAbbreviation} />;
  }

  renderText(xVal) {
    const { id, teams, players, ranks } = this.props;
    const tid = this.getTeamId(id);
    const entity = getEntity(players, teams, id);

    if (entity == null) {
      return 'Entity not found...';
    }

    const stat = entity.stats[xVal];
    const rank = ranks[id];
    const precision = Number.isInteger(stat) ? 0 : 3;
    const teamAbbreviation = teams[tid].abbreviation;

    return (
      <div>
        <div>{entity.name}</div>
        <div>{teamAbbreviation}</div>
        <div>{`${statNames[xVal]}: ${stat.toFixed(precision)}`}</div>
        <div>{`Rank: ${rank}`}</div>
      </div>
    );
  }

  renderPlayerHead(id) {
    const props = {
      src: getPlayerHeadURL(id),
      alt: 'ALT',
    };
    return (
      <img {...props} />
    );
  }

  render() {
    const { x, y, id, xVal, toggleSelected, nbaId } = this.props;
    const tid = this.getTeamId(id);
    const position = { top: `${80 - y}%`, left: `${x}%` };

    return (
      <div className={styles.tooltip} style={position}>
        {this.renderPlayerHead(nbaId)}
        {this.renderText(xVal)}
        {this.getTeamLogo(tid)}
        <div className={styles.closeButton} onClick={toggleSelected.bind(this, id)}>X</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: state.get('dataReducer').players,
    teams: state.get('dataReducer').teams,
    ranks: rankSelector(state),
    xVal: state.get('dataReducer').xVal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(playPenActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tooltip);

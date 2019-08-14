import React, { Component } from 'react';
import { connect } from 'react-redux';
import ShotChart from './ShotChart';

class PlayerShotChart extends Component {
  static propTypes = {
    pid: React.PropTypes.string,
    players: React.PropTypes.object.isRequired,
    shots: React.PropTypes.object.isRequired,
  }

  render() {
    const { players, shots, pid } = this.props;
    const player = players[pid];
    if (player === undefined) {
      return null;
    }

    const shotsToUse = shots[player.newPid] || [];

    return (
      <div>
        <div>{player.name}</div>
        <ShotChart shots={shotsToUse} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: state.get('dataReducer').players,
    shots: state.get('dataReducer').shots,
  };
}

export default connect(mapStateToProps)(PlayerShotChart);

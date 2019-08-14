import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayerShotChart from '../components/PlayerShotChart';
import TeamMap from './TeamMapContainer';

class ShotChartMap extends Component {
  static propTypes = {
    selectedPlayers: React.PropTypes.instanceOf(Set).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { hideMap: false };
  }

  toggleMapOn() {
    this.setState({ hideMap: !this.state.hideMap });
  }

  renderMap() {
    if (this.state.hideMap) {
      return null;
    }

    return <TeamMap />;
  }

  render() {
    const { selectedPlayers } = this.props;

    return (
      <div>
        <div><button onClick={this.toggleMapOn.bind(this)}>Toggle Map</button></div>
        {this.renderMap()}
        <div>
          {Array.from(selectedPlayers).map((pid, idx) =>
            <PlayerShotChart key={idx} pid={pid} />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedPlayers: state.get('dataReducer').selectedPlayers,
  };
}

export default connect(mapStateToProps)(ShotChartMap);

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as playPenActions from '../actions/playpenActions';
import Constants from '../constants';
import { rankSelector } from '../reducers/store-selector.js';
import getPlayerHeadURL from '../utils/player-head-util.js';

const oddTeamAbbreviations = Constants.oddTeamAbbreviations;

class TeamMapMarker extends Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    google: PropTypes.object.isRequired,
    currentInfoWindow: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    players: React.PropTypes.object,
    selectedPlayers: React.PropTypes.instanceOf(Set).isRequired,
    teamId: PropTypes.string.isRequired,
    ranks: React.PropTypes.object,
    xVal: React.PropTypes.number,
    setCurrentInfoWindow: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.marker = null;
  }

  getTeamLogo(tid) {
    const rawAbbreviation = this.props.teams[tid].abbreviation;
    const teamAbbreviation = rawAbbreviation in oddTeamAbbreviations ?
      oddTeamAbbreviations[rawAbbreviation] :
      rawAbbreviation;
    const url = `http://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${teamAbbreviation}.png&h=150&w=150`;
    return url;
  }

  playerHeadClicked(playerId) {
    this.props.toggleSelected(playerId);
  }

  createPlayerHeads(tid) {
    const selectedPlayers = this.props.selectedPlayers;
    const playerList = this.props.teams[tid].players;
    const playerHeads = [];

    playerList.forEach((pid) => {
      const player = this.props.players[pid];
      if (player !== undefined) {
        const url = getPlayerHeadURL(player.nbaId);
        const playerHead = document.createElement('button');
        playerHead.className = selectedPlayers.has(pid) ? 'selectedplayerbutton' : 'playerbutton';
        const title = document.createElement('IMG');
        title.className = 'playerimage';
        title.src = url;
        const playerName = document.createElement('div');
        playerName.className = 'playername';
        playerName.innerHTML = player.name;
        playerHead.appendChild(title);
        playerHead.appendChild(playerName);

        playerHead.addEventListener('click', () => {
          this.playerHeadClicked(pid);
          if (playerHead.className === 'selectedplayerbutton') {
            playerHead.className = 'playerbutton';
          } else {
            playerHead.className = 'selectedplayerbutton';
          }
        });

        playerHeads.push(playerHead);
      }
    });
    return playerHeads;
  }

  handleClick(marker) {
    const currentInfoWindow = this.props.currentInfoWindow;

    // make sure to close the current info window so only one is displayed at once
    if (Object.keys(currentInfoWindow).length !== 0) {
      currentInfoWindow.close();
    }

    const infoContainer = document.createElement('div');
    const url = this.getTeamLogo(this.props.teamId);
    const image = document.createElement('img');
    image.src = url;
    infoContainer.appendChild(image);

    const playerHeads = this.createPlayerHeads(this.props.teamId);
    playerHeads.forEach((playerHead) => {
      infoContainer.appendChild(playerHead);
    });

    const infoWindow = new this.props.google.maps.InfoWindow({
      content: infoContainer,
    });

    infoWindow.open(this.props.map, marker);
    this.props.setCurrentInfoWindow(infoWindow);
  }

  renderMarker() {
    const { map, google, position } = this.props;
    if (map === undefined || google === undefined) {
      return;
    }
    const preurl = this.getTeamLogo(this.props.teamId);
    const image = {
      url: preurl,
      scaledSize: new google.maps.Size(65, 65), // scaled size
    };
    const pref = {
      icon: image,
      scaledSize: new google.maps.Size(1, 1),
      map,
      position,
    };

    this.marker = new google.maps.Marker(pref);
    this.marker.addListener('click', this.handleClick.bind(this, this.marker));
  }

  render() {
    return (
      <div>
        {this.renderMarker()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentInfoWindow: state.get('dataReducer').currentInfoWindow,
    teams: state.get('dataReducer').teams,
    players: state.get('dataReducer').players,
    selectedPlayers: state.get('dataReducer').selectedPlayers,
    ranks: rankSelector(state),
    xVal: state.get('dataReducer').xVal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(playPenActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamMapMarker);

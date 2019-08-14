import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playPenActions from '../../actions/playpenActions';

import styles from './Point.scss';
import Tooltip from './Tooltip';

class Point extends Component {
  static propTypes = {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    id: React.PropTypes.string,
    selectedPlayers: React.PropTypes.instanceOf(Set),
    toggleSelected: React.PropTypes.func,
    players: React.PropTypes.object,
  }

  constructor() {
    super();
    this.state = { hover: false };
  }

  shouldComponentUpdate(nextProps) {
    const nextSelectedPlayers = nextProps.selectedPlayers;
    const { selectedPlayers, id } = this.props;
    if (nextSelectedPlayers.size > 0 && nextSelectedPlayers !== selectedPlayers) {
      return nextSelectedPlayers.has(id) || selectedPlayers.has(id);
    }

    return true;
  }

  handleMouseIn() {
    this.setState({ hover: true });
  }

  handleMouseOut() {
    this.setState({ hover: false });
  }

  render() {
    const { x, y, id, selectedPlayers, toggleSelected, players } = this.props;
    const nbaId = players[id] ? players[id].nbaId : null;
    const isSelected = selectedPlayers.has(id);
    const props = { x, y, id, nbaId };

    const pointProps = {
      className: styles.point,
      id: `POINT_${id}`,
      style: {
        top: `${100 - y}%`,
        left: `${x}%`,
        borderColor: isSelected ? 'red' : 'black'
      },
      onClick: () => toggleSelected(id),
    };

    return (
      <div onMouseOver={this.handleMouseIn.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
        <div {...pointProps} />
        {this.state.hover || isSelected ? <Tooltip {...props} /> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedPlayers: state.get('dataReducer').selectedPlayers,
    players: state.get('dataReducer').players,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(playPenActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Point);

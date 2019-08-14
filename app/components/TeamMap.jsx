import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TeamMapMarker from './TeamMapMarker';
import teamLocations from './teamLocations';
import style from './TeamMap.scss';
import * as playPenActions from '../actions/playpenActions';

class TeamMap extends Component {

  static propTypes = {
    google: PropTypes.object,
    teams: PropTypes.object.isRequired,
    signalMapIsLoaded: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.map = null;
    this.mapNode = null;
    this.state = {
      mapLoaded: false,
    };
  }

  componentDidMount() {
    this.loadMap();
    // Signal map is loaded to change to 'team' view.
    this.props.signalMapIsLoaded();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
      this.props.signalMapIsLoaded();
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;
      const zoom = 4;
      // center around middle of US
      const lat = 39;
      const lng = -98;
      const styles = [
            { elementType: 'geometry.fill', stylers: [{ color: '#000000' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        { featureType: 'administrative.locality',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        { featureType: 'administrative.country',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        { featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }]
        },
        { featureType: 'water',
          elementType: 'labels.text',
          stylers: [{ visibility: 'off' }]
        },
        { featureType: 'landscape',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        { featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        { featureType: 'transit',
          stylers: [{ visibility: 'off' }]
        },
        { featureType: 'road',
          stylers: [{ visibility: 'off' }]
        },
      ];
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center,
        zoom,
        styles,
      });
      this.map = new maps.Map(this.mapNode, mapConfig);

      this.setState({
        mapLoaded: true,
      });
    }
  }

  createMarker(position, teamId, index) {
    const markerProps = {
      map: this.map,
      google: this.props.google,
      position,
      teamId,
      key: index
    };
    return <TeamMapMarker {...markerProps} />;
  }

  renderMarkers() {
    const mapMarkers = [];
    const teams = this.props.teams;
    const locations = teamLocations.Locations;
    let index = 0;
    Object.keys(teams).forEach(tid => {
      const teamAbbr = teams[tid].abbreviation;
      const teamLoc = locations[teamAbbr];

      if (teamLoc !== undefined) {
        const position = {
          lat: teamLoc.Lat,
          lng: teamLoc.Long,
        };

        mapMarkers.push(this.createMarker(position, tid, index));
        index += 1;
      }
    });

    return mapMarkers;
  }

  render() {
    return (
      <div className={style.map} ref={(node) => { this.mapNode = node; }}>
        Loading google map...
        <div>
          {this.state.mapLoaded ? this.renderMarkers() : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: state.get('dataReducer').teams,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(playPenActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamMap);

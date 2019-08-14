import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import TeamMap from '../components/TeamMap';

class TeamMapContainer extends Component {
  render() {
    return <TeamMap google={window.google} />;
  }
}

// eslint-disable-next-line new-cap
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo'
})(TeamMapContainer);

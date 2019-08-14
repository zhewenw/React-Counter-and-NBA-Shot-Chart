import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import PlayPen from './containers/PlayPenPage';
import { Plot, Histogram, DiscreteHistogram } from './components/graphs';
import ShotChartMap from './containers/ShotChartMap';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/counter" component={CounterPage} />
    <Route path="/playpen" component={PlayPen}>
      <Route path="/plot" component={Plot} />
      <Route path="/histogram" component={Histogram} />
      <Route path="/discreteHistogram" component={DiscreteHistogram} />
      <Route path="/shotChartMap" component={ShotChartMap} />
    </Route>
  </Route>
);

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';

require('velocity-animate');
require('velocity-animate/velocity.ui');

window.React = React;
window.Component = React.Component;

const { store, history } = configureStore();

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

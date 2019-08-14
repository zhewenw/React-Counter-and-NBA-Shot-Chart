import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { push, syncHistoryWithStore } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import { reducer } from '../reducers';
import { watchForInitializePlayers, watchForInitializeTeams } from '../reducers/sagas';

const actionCreators = { push };

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

const sagaMiddleware = createSagaMiddleware();

const enhancer = compose(
  applyMiddleware(logger, sagaMiddleware),
  window.devToolsExtension ?
    window.devToolsExtension({ actionCreators }) :
    noop => noop
);

export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, enhancer);
  const history = syncHistoryWithStore(hashHistory, store, {
    selectLocationState: (s) => s.get('routing').toJS()
  });

  sagaMiddleware.run(watchForInitializePlayers);
  sagaMiddleware.run(watchForInitializeTeams);

  if (window.devToolsExtension) {
    window.devToolsExtension.updateStore(store);
  }

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return { store, history };
}

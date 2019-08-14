import { combineReducers } from 'redux-immutable';
import data from './data';
import router from './router';
import rootSaga from './sagas';

const reducer = combineReducers({
  dataReducer: data,
  routing: router,
});

const sagas = [
  rootSaga
];

export { sagas, reducer };

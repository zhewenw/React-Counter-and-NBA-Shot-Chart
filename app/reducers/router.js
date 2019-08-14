import { LOCATION_CHANGE } from 'react-router-redux';
import { Map } from '../utils';

const routerState = new Map({ locationBeforeTransitions: null });

export default function reducer(state = routerState, action) {
  if (action.type === LOCATION_CHANGE) {
    return state.merge({
      locationBeforeTransitions: action.payload
    });
  }

  return state;
}

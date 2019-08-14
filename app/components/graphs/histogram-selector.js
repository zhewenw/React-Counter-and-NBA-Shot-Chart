import { createSelector } from 'reselect';
import { bins } from './utils';

export default createSelector(
  props => props.data,
  props => props.x,
  props => props.bins,
  bins
);

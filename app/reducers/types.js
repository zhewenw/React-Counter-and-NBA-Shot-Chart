const types = {};

function register(namespace, ...subTypes) {
  const sub = types[namespace] = types[namespace] || {};
  for (const t of subTypes) {
    sub[t] = `${namespace}.${t}`;
  }

  exports[namespace] = sub;
}

register('DATA', 'FETCH', 'PUT');

export const CHANGE_RANKINGS_DATA = 'CHANGE_RANKINGS_DATA';
export const UPDATE_RANKINGS_DATA = 'types.UPDATE_RANKINGS_DATA';
export const CHANGE_NUM_BINS = 'CHANGE_NUM_BINS';
export const DISCRETE_HISTOGRAM_POINTS_ARE_RENDERED = 'DISCRETE_HISTOGRAM_POINTS_ARE_RENDERED';
export const PLOT_POINTS_ARE_RENDERED = 'PLOT_POINTS_ARE_RENDERED';
export const TOGGLE_SELECTED = 'TOGGLE_SELECTED';
export const CHANGE_MIN_SHOTS = 'CHANGE_MIN_SHOTS';
export const GRAPH_CHANGED = 'GRAPH_CHANGED';
export const INITIALIZE_PLAYERS = 'INITIALIZE_PLAYERS';
export const SET_PLAYERS = 'SET_PLAYERS';
export const INITIALIZE_TEAMS = 'INITIALIZE_TEAMS';
export const SET_TEAMS = 'SET_TEAMS';
export const LOCATION_CHANGED = 'LOCATION_CHANGED';
export const TOGGLE_DATA_VIEW = 'TOGGLE_DATA_VIEW';
export const SET_CURRENT_INFO_WINDOW = 'SET_CURRENT_INFO_WINDOW';
export const MAP_IS_LOADED = 'MAP_IS_LOADED';
export const CHANGE_DH_TABLE_NUM = 'CHANGE_DH_TABLE_NUM';
export const CHANGE_PLOT_TABLE_NUM = 'CHANGE_PLOT_TABLE_NUM';

import * as types from '../reducers/types';

export function changeRankingsDataAction(xVal, yVal) {
  return {
    type: types.CHANGE_RANKINGS_DATA,
    xVal,
    yVal
  };
}

export function changeNumberOfBins(bins) {
  return {
    type: types.CHANGE_NUM_BINS,
    bins,
  };
}

export function toggleSelected(id) {
  return {
    type: types.TOGGLE_SELECTED,
    id,
  };
}

export function signalDiscreteHistogramPointsAreRendered() {
  return {
    type: types.DISCRETE_HISTOGRAM_POINTS_ARE_RENDERED,
  };
}

export function changeDHTableNum(dhTableNum) {
  return {
    type: types.CHANGE_DH_TABLE_NUM,
    dhTableNum,
  };
}

export function changePlotTableNum(plotTableNum) {
  return {
    type: types.CHANGE_PLOT_TABLE_NUM,
    plotTableNum,
  };
}

export function signalPlotPointsAreRendered() {
  return {
    type: types.PLOT_POINTS_ARE_RENDERED,
  };
}

export function signalLocationChange() {
  return {
    type: types.LOCATION_CHANGED,
  };
}

export function changeMinShots(minShots) {
  return {
    type: types.CHANGE_MIN_SHOTS,
    minShots,
  };
}

export function initializePlayers() {
  return {
    type: types.INITIALIZE_PLAYERS,
  };
}

export function setPlayers(players) {
  return {
    type: types.SET_PLAYERS,
    players,
  };
}

export function initializeTeams() {
  return {
    type: types.INITIALIZE_TEAMS,
  };
}

export function setTeams(teams) {
  return {
    type: types.SET_TEAMS,
    teams,
  };
}

export function toggleDataView(nextView) {
  return {
    type: types.TOGGLE_DATA_VIEW,
    nextView
  };
}

export function setCurrentInfoWindow(infoWindow) {
  return {
    type: types.SET_CURRENT_INFO_WINDOW,
    infoWindow,
  };
}

export function signalMapIsLoaded() {
  return {
    type: types.MAP_IS_LOADED,
  };
}

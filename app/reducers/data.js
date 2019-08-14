import { types } from '../utils';
import { shotsTransform } from './transform';
import shotsRaw from '../../data/shots.json';

const shots = shotsTransform(shotsRaw);

const defaultState = {
  dataView: 'player',
  selectedPlayers: new Set(),
  players: {},
  teams: {},
  shots,
  xVal: 0,
  yVal: 1,
  bins: 50,
  minShots: 50,
  dhTableNum: 0,
  discreteHistogramPointsAreRendered: false,
  plotTableNum: 0,
  plotPointsAreRendered: false,
  currentInfoWindow: {},
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case types.CHANGE_RANKINGS_DATA: {
      return {
        ...state,
        xVal: action.xVal,
        yVal: action.yVal,
        dhTableNum: 0,
        discreteHistogramPointsAreRendered: false,
        plotTableNum: 0,
        plotPointsAreRendered: false,
      };
    }
    case types.CHANGE_NUM_BINS: {
      return { ...state, bins: action.bins };
    }

    case types.LOCATION_CHANGED:
      return {
        ...state,
        selectedPlayers: new Set(),
        dhTableNum: 0,
        discreteHistogramPointsAreRendered: false,
        plotTableNum: 0,
        plotPointsAreRendered: false,
      };

    case types.DISCRETE_HISTOGRAM_POINTS_ARE_RENDERED:
      return { ...state, discreteHistogramPointsAreRendered: true };
    case types.CHANGE_DH_TABLE_NUM:
      return { ...state, dhTableNum: action.dhTableNum };
    case types.PLOT_POINTS_ARE_RENDERED:
      return { ...state, plotPointsAreRendered: true };
    case types.CHANGE_PLOT_TABLE_NUM:
      return { ...state, plotTableNum: action.plotTableNum };

    case types.TOGGLE_SELECTED: {
      const selectedPlayers = new Set(state.selectedPlayers.keys());
      if (selectedPlayers.has(action.id)) {
        selectedPlayers.delete(action.id);
      } else {
        selectedPlayers.add(action.id);
      }
      return { ...state, selectedPlayers };
    }
    case types.CHANGE_MIN_SHOTS: {
      return { ...state, minShots: action.minShots };
    }
    case types.SET_PLAYERS: {
      return { ...state, players: action.players, };
    }
    case types.SET_TEAMS: {
      return { ...state, teams: action.teams, };
    }
    case types.TOGGLE_DATA_VIEW: {
      return {
        ...state,
        selectedPlayers: new Set(),
        dhTableNum: 0,
        discreteHistogramPointsAreRendered: false,
        plotTableNum: 0,
        plotPointsAreRendered: false,
        dataView: action.nextView,
      };
    }
    case types.SET_CURRENT_INFO_WINDOW: {
      return { ...state, currentInfoWindow: action.infoWindow };
    }
    case types.MAP_IS_LOADED: {
      return { ...state, dataView: 'team' };
    }
    default: {
      return state;
    }
  }
}

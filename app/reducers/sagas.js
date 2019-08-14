import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { types } from '../utils';
import { getPlayers, getTeams } from '../api/db-query';
import { setPlayers, setTeams } from '../actions/playpenActions';

function* initializePlayers() {
  const players = yield getPlayers();
  yield put(setPlayers(players));
}

export function* watchForInitializePlayers() {
  yield* takeEvery(types.INITIALIZE_PLAYERS, initializePlayers);
}

function* initializeTeams() {
  const teams = yield getTeams();
  yield put(setTeams(teams));
}

export function* watchForInitializeTeams() {
  yield* takeEvery(types.INITIALIZE_TEAMS, initializeTeams);
}

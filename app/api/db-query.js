import PouchDB from 'pouchdb';
import Constants from '../constants';

function buildPlayerFromRow(row) {
  const { name, stats, tid, nbaId, newPid } = row.value;
  const playerStats = [];
  if (stats) {
    Constants.statNames.forEach((stat) => {
      playerStats.push(stats[stat]);
    });
  }
  return {
    name,
    stats: playerStats,
    tid,
    nbaId,
    newPid,
  };
}

export async function getPlayers() {
  const db = new PouchDB('http://localhost:5984/basketball', { adapter: 'http' });
  const response = await db.query('players/playersWithTeam');
  const players = {};
  response.rows.forEach((row) => {
    const id = row.id;
    players[id] = buildPlayerFromRow(row);
  });
  return players;
}

function buildTeamFromRow(row) {
  const { abbreviation, stats, players } = row.value;
  const teamStats = [];
  Constants.statNames.forEach((stat) => {
    teamStats.push(stats[stat]);
  });
  return {
    abbreviation,
    stats: teamStats,
    players,
    name: abbreviation,
  };
}

export async function getTeams() {
  const db = new PouchDB('http://localhost:5984/basketball', { adapter: 'http' });
  const response = await db.query('teams/teams');
  const teams = {};
  response.rows.forEach((row) => {
    const id = row.id;
    teams[id] = buildTeamFromRow(row);
  });
  return teams;
}

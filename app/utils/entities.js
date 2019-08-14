export function getTeamId(players, teams, id) {
  if (teams[id] !== undefined) {
    return id;
  }

  return players[id].tid;
}

export function getEntity(players, teams, id) {
  const tid = getTeamId(players, teams, id);
  return id === tid ? teams[tid] : players[id];
}

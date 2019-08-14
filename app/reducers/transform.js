const HALFCOURT_LENGTH = 47;

// Transforms rankings into suitable data format.
export function rankingsTransform(raw) {
  return raw.map(obj =>
    // eslint-disable-next-line no-underscore-dangle
    ({ playerId: obj._1[0], stats: obj._2 })
  );
}

export function playersTransform(playersRaw, newIds, rankings = []) {
  const players = {};
  Object.keys(playersRaw).forEach(pid => {
    players[pid] = transformSinglePlayer(playersRaw[pid]);
  });

  // Supplement players map with statistics
  for (const row of rankings) {
    const player = players[row.playerId];
    if (player !== undefined) {
      player.stats = row.stats;
    }
  }

  // Remove players without stats
  for (const pid of Object.keys(players)) {
    if (players[pid].stats === undefined) {
      delete players[pid];
    }
  }

  // Create a reverse name -> pid lookup
  // This only works while all player names are unique.
  const nameToPid = {};
  for (const pid of Object.keys(players)) {
    nameToPid[players[pid].name] = pid;
  }

  // Iterate through newIds, looking for matching names and sending it out.
  for (const newPid of Object.keys(newIds)) {
    const name = constructName(newIds[newPid]);
    const pid = nameToPid[name];
    if (pid !== undefined) {
      players[pid].newPid = newPid;
    }
  }

  return players;
}

// Transform raw team input into a map of tid => abbreviation
export function teamsTransform(teamsRaw, players) {
  const teams = {};
  Object.keys(teamsRaw).forEach(tid => {
    teams[tid] = transformSingleTeam(teamsRaw[tid], players);
  });

  return teams;
}

function transformSinglePlayer(rawPlayer) {
  return { name: constructName(rawPlayer), tid: rawPlayer.tid };
}

function constructName(raw) {
  return `${raw.first_name} ${raw.last_name}`;
}

// The team stats generated are just a weighted-by-FGA average of the players
// statistics
function transformSingleTeam(rawTeam, players) {
  const playerNums = rawTeam.players;

  const teamStats = [0, 0, 0, 0];
  const teamPlayers = [];
  for (const key of Object.keys(playerNums)) {
    const pid = playerNums[key].pid;
    teamPlayers.push(pid);
    const player = players[playerNums[key].pid];
    if (player !== undefined) {
      // Increment FGA, and other stats weighted by FGA
      teamStats[0] += player.stats[0];
      for (let i = 1; i < 4; i += 1) {
        teamStats[i] += (player.stats[0] * player.stats[i]);
      }
    }
  }

  // Renormalize non-FGA stats
  for (let i = 1; i < 4; i += 1) {
    teamStats[i] /= teamStats[0];
  }

  return {
    abbreviation: rawTeam.abbreviation,
    stats: teamStats,
    players: teamPlayers,
    name: rawTeam.full_name
  };
}

export function shotsTransform(shotsRaw) {
  const shots = {};
  for (const raw of shotsRaw) {
    // eslint-disable-next-line no-underscore-dangle
    const arr = raw._2;
    const pid = arr[0];

    // Ignore anything not in the half-court
    if (arr[5][0] <= HALFCOURT_LENGTH) {
      const obj = { made: arr[1], x: arr[5][0], y: arr[5][1] };

      // Get shots[pid] if it exists, else intialize it to []
      const shotArr = shots[pid] || (shots[pid] = []);
      shotArr.push(obj);
    }
  }

  return shots;
}

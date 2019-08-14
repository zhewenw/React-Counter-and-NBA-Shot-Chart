import { createSelector } from 'reselect';

function toRankingsArray(idStatMap) {
  return Object.keys(idStatMap).map(id =>
    ({ id, stats: idStatMap[id].stats })
  );
}

const dataSelector = createSelector(
  state => state.get('dataReducer').players,
  state => state.get('dataReducer').teams,
  state => state.get('dataReducer').dataView,
  (players, teams, view) =>
    toRankingsArray(view === 'player' ? players : teams)
);

export const shotSelector = createSelector(
  dataSelector,
  state => state.get('dataReducer').minShots,
  (data, minShots) => {
    const shotFilter = obj => obj.stats[0] >= minShots;
    return data.filter(shotFilter);
  }
);

export const rankSelector = createSelector(
  shotSelector,
  state => state.get('dataReducer').xVal,
  (statsArray, sortIndex) => {
    // Use .slice() to make sure the original array is not modified
    const sorted = statsArray.slice().sort((a, b) => b.stats[sortIndex] - a.stats[sortIndex]);
    const ranks = {};
    sorted.forEach((row, index) => {
      ranks[row.id] = index + 1;
    });

    return ranks;
  }
);

import PouchDB from 'pouchdb';
import { rankingsTransform, playersTransform, teamsTransform } from './transform';
import rankings from '../../data/rankings.json';
import playersRaw from '../../data/players.json';
import playersNewIds from '../../data/player-new-ids.json';
import teamsRaw from '../../data/teams.json';
import nbaId from '../../data/nba-id.json';

const initialData = rankingsTransform(rankings);
const players = playersTransform(playersRaw, playersNewIds, initialData);
const teams = teamsTransform(teamsRaw, players);


export default function seedDB() {
  let db = new PouchDB('http://localhost:5984/basketball', { adapter: 'http' });
  db.destroy().then(() => {
    db = new PouchDB('http://localhost:5984/basketball', { adapter: 'http' });

    Object.keys(teams).forEach((key) => {
      db.get(key).catch((error) => {
        if (error.status === 404) {
          const team = teams[key];
          return db.put({
            _id: key,
            type: 'team',
            abbreviation: team.abbreviation,
            stats: {
              FGA: team.stats[0],
              eFG: team.stats[1],
              qSQ: team.stats[2],
              qSI: team.stats[3],
            },
            players: team.players,
          });
        }
      });
    });

    Object.keys(players).forEach((key) => {
      db.get(key).catch((error) => {
        if (error.status === 404) {
          const player = players[key];
          const data = {
            _id: key,
            type: 'player',
            name: player.name,
            tid: player.tid,
            nbaId: nbaId[player.name],
            newPid: player.newPid,
          };
          if (player.stats !== undefined) {
            data.stats = {
              FGA: player.stats[0],
              eFG: player.stats[1],
              qSQ: player.stats[2],
              qSI: player.stats[3],
            };
          }
          return db.put(data);
        }
      });
    });

    const playersWithTeam = ((doc) => {
      if (doc.type === 'player') {
        // eslint-disable-next-line no-underscore-dangle, no-undef
        emit(doc._id,
          { name: doc.name, stats: doc.stats, tid: doc.tid, nbaId: doc.nbaId, newPid: doc.newPid }
        );
      }
    }).toString();

    const playersWithImages = ((doc) => {
      if (doc.type === 'player' && doc.nbaId) {
        // eslint-disable-next-line no-underscore-dangle, no-undef
        emit(doc._id,
          { name: doc.name, stats: doc.stats, tid: doc.tid, nbaId: doc.nbaId, newPid: doc.newPid }
        );
      }
    }).toString();

    const teamAbbreviations = ((doc) => {
      if (doc.type === 'team') {
        // eslint-disable-next-line no-underscore-dangle, no-undef
        emit(doc._id, doc.abbreviation);
      }
    }).toString();

    const teamPlayers = ((doc) => {
      if (doc.type === 'team') {
        doc.players.forEach((player) => {
          // eslint-disable-next-line no-underscore-dangle, no-undef
          emit(doc._id, { _id: player });
        });
      }
    }).toString();

    const teamStats = ((doc) => {
      if (doc.type === 'team') {
        // eslint-disable-next-line no-underscore-dangle, no-undef
        emit(doc._id, doc.stats);
      }
    }).toString();

    const teamsMap = ((doc) => {
      if (doc.type === 'team') {
        // eslint-disable-next-line no-underscore-dangle, no-undef
        emit(doc._id, { abbreviation: doc.abbreviation, stats: doc.stats, players: doc.players });
      }
    }).toString();

    const designDocs = [
      {
        _id: '_design/players',
        views: {
          playersWithTeam: {
            map: playersWithTeam,
          },
          playersWithImages: {
            map: playersWithImages,
          },
        }
      },
      {
        _id: '_design/teams',
        views: {
          teamAbbreviations: {
            map: teamAbbreviations,
          },
          teamPlayers: {
            map: teamPlayers,
          },
          teamStats: {
            map: teamStats,
          },
          teams: {
            map: teamsMap,
          },
        }
      }
    ];

    designDocs.forEach((ddoc) => {
      db.put(ddoc).catch((err) => {
        if (err.name !== 'conflict') {
          throw err;
        }
      });
    });
  });

  return db;
}

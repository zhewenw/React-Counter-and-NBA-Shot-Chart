import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import styles from './RankingsTable.scss';

import tableConstants from './TableConstants';
import RankingsTableRow from './RankingsTableRow';
import { getEntity } from '../utils/entities.js';

class RankingsTable extends Component {
  static propTypes = {
    players: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    tableNum: PropTypes.number.isRequired,
    positions: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const { players, teams } = this.props;
    const tableNum = this.props.tableNum;

    // dataArray is the array of all the player objects
    const dataArray = this.props.positions;
    const dataArrayLength = dataArray.length;
    const tableRows = [];
    const firstRow = (dataArrayLength - 1) - (tableConstants.numRows * tableNum);
    let lastRow = firstRow - tableConstants.numRows;

    // If there were 478 players, on the last table, firstRow
    // would be 28 and last row would be -22, so need to
    // reset lastRow to -1 that will represent the last ranked player.
    if (lastRow < 0) {
      lastRow = -1;
    }

    for (let i = firstRow; i > lastRow; i -= 1) {
      const row = dataArray[i].row;
      if (row.id !== null) {
        const entity = getEntity(players, teams, row.id);
        if (entity !== undefined) {
          const rank = dataArrayLength - i;
          const percentile = ((dataArrayLength - rank) / dataArrayLength) * 100;
          const myProps = {
            key: i,
            stats: row.stats,
            entityId: row.id,
            name: entity.name,
            nbaId: entity.nbaId,
            rank,
            percentile,
          };
          tableRows.push(myProps);
        }
      }
    }

    return (
      <table className={styles.table} >
        <thead>
          <tr>
            <th className={styles.th}>Rank</th>
            <th className={styles.th} />
            <th className={styles.th}>Player Name</th>
            <th className={styles.th}>Shots Attempted</th>
            <th className={styles.th}>Effective FG</th>
            <th className={styles.th}>Shot Quality</th>
            <th className={styles.th}>Shooter Impact</th>
            <th className={styles.th}>Percentile Rank</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((props) =>
            <RankingsTableRow {...props} />
        )}
        </tbody>
      </table>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: state.get('dataReducer').players,
    teams: state.get('dataReducer').teams,
  };
}

export default connect(mapStateToProps)(RankingsTable);

import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import styles from './PlotTable.scss';
import tableConstants from './TableConstants';
import constants from '../constants';
import { getEntity } from '../utils/entities.js';

import PlotTableRow from './PlotTableRow';

const statNames = constants.statNames;

class PlotTable extends Component {
  static propTypes = {
    players: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    tableNum: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    xVal: PropTypes.number.isRequired,
    yVal: PropTypes.number.isRequired,
  };

  render() {
    const { players, teams, xVal, yVal } = this.props;

    const tableNum = this.props.tableNum;
    // unlike the data for the discrete histogram, there is no implicit order in which the
    // data of the players is passed to the plot table.
    const unsortedData = this.props.rows;

    // need to sort by xAxis in descending order.
    const dataArray = unsortedData.sort((a, b) => {
      if (a.x < b.x) {
        return -1;
      }
      return 1;
    });

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

    /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
    for (let i = firstRow; i > lastRow; i--) {
      const row = dataArray[i].row;

      if (row.id !== null) {
        const entity = getEntity(players, teams, row.id);
        if (entity !== undefined) {
          const rank = dataArrayLength - i;
          const percentile = ((dataArrayLength - rank) / dataArrayLength) * 100;
          const myProps = {
            key: i,
            xVal: row.stats[xVal],
            yVal: row.stats[yVal],
            entityId: row.id,
            name: entity.name,
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
            <th className={styles.th}>X: {statNames[xVal]}</th>
            <th className={styles.th}>Y: {statNames[yVal]}</th>
            <th className={styles.th}>Player Name</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((props) =>
            <PlotTableRow {...props} />
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

export default connect(mapStateToProps)(PlotTable);

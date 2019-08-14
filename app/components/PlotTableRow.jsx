import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as playPenActions from '../actions/playpenActions';

import styles from './PlotTable.scss';
import tableConstants from './TableConstants';

class PlotTableRow extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    entityId: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    toggleSelected: PropTypes.func.isRequired,
    selectedPlayers: PropTypes.instanceOf(Set),
    xVal: PropTypes.number.isRequired,
    yVal: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const pointId = `POINT_${this.props.entityId}`;
    const point = document.getElementById(pointId);

    const pointTop = point.getBoundingClientRect().top;
    const pointLeft = point.getBoundingClientRect().left;

    const tableRow = this.tableRow;
    const actualTop = tableRow.getBoundingClientRect().top;
    const actualLeft = tableRow.getBoundingClientRect().left;

    // -4 to account for the padding
    const offsetTop = pointTop - actualTop - tableConstants.plotPointTopPadding;
    const offsetLeft = pointLeft - actualLeft - tableConstants.plotPointLeftPadding;

    // Shifts the table rows to the point location from the actual location in
    // the table
    tableRow.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    tableRow.style.transition = 'transform 0s ease-in-out';

    this.animatePoints(tableRow);
  }

  shouldComponentUpdate(nextProps) {
    const nextSelectedPlayers = nextProps.selectedPlayers;
    const { selectedPlayers, entityId } = this.props;
    return (nextSelectedPlayers.has(entityId) && !selectedPlayers.has(entityId))
      || (!nextSelectedPlayers.has(entityId) && selectedPlayers.has(entityId));
  }

  animatePoints(tr) {
    const tableRow = tr;
    setTimeout(() => {
      const childNodes = tableRow.childNodes;

      const rank = this.props.rank;
      const { numRows, perRowDelay } = tableConstants;

      // Need - 1 otherwise the last player in the table will have a transistion
      // time of 0.
      const transitionTime = ((rank - 1) % numRows) * perRowDelay;

      tableRow.style.transition = `transform ${transitionTime}ms ease-in-out`;
      tableRow.style.transform = '';

      setTimeout(() => {
        // Initially hid the text and changed the background color in order to
        // form solid points that resembled the points on the graph. Need to
        // add the text back so the rankings show and then remove the background
        // color.
        tableRow.childNodes[0].innerHTML = Math.round(this.props.xVal * 1000) / 1000;
        tableRow.childNodes[0].classList.remove(styles.xValBefore);
        tableRow.style.transition = '';
        tableRow.classList.add(styles.loadedTableRow);

        // Initially, all of the table data was hidden, so we need to remove
        // this visibility constraint in order to show the table data.
        for (const childNode of childNodes) {
          // childNode.style.visibility = "";
          if (childNode.classList.contains(styles.yValBefore)) {
            childNode.classList.remove(styles.yValBefore);
            childNode.classList.add(styles.yValAfter);
          }
          if (childNode.classList.contains(styles.playerNameBefore)) {
            childNode.classList.remove(styles.playerNameBefore);
            childNode.classList.add(styles.playerNameAfter);
          }
        }
      }, tableConstants.initialDelay + transitionTime);
    }, tableConstants.initialDelay);
  }

  render() {
    const { name, yVal, entityId, selectedPlayers } = this.props;
    const isSelected = selectedPlayers.has(entityId);
    const rowProps = {
      ref: (ref) => (this.tableRow = ref),
      onClick: () => this.props.toggleSelected(entityId),
      className: isSelected ? styles.selectedRow : '',
    };

    return (
      <tr {...rowProps}>
        <td className={styles.xValBefore} />
        <td className={styles.yValBefore}> {Math.round(yVal * 1000) / 1000} </td>
        <td className={styles.playerNameBefore}> {name} </td>
      </tr>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedPlayers: state.get('dataReducer').selectedPlayers,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(playPenActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlotTableRow);

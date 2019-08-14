import { createSelector } from 'reselect';
import { bins } from './utils';

export default createSelector(
  props => props.data,
  props => props.x,
  props => props.bins,

  (rows, xFn, binCount) => {
    const { xScale, yScale, counts, binner } = bins(rows, xFn, binCount);
    const sorted = rows.sort((a, b) => xFn(a) - xFn(b));

    // Generate a minimum height and width such that the points in the histogram
    // are distinguishable.
    // We assume each point is height/width 10px. We want to give them 4px
    // spacing as well.
    const maxBinSize = Math.max(...counts);
    const minHeight = 14 * maxBinSize;
    const minWidth = 14 * binCount;
    // Generate an offset for the x-values to make them match with ticks
    const xMin = xFn(sorted[0]);
    const xOffset = xScale(xMin) - ((Math.floor(binner(xMin)) / binCount) * 100);

    const positions = new Array(rows.length);
    let rowIdx = 0;
    for (const row of sorted) {
      const val = xFn(row);

      const colIdx = Math.floor(binner(val));
      const x = ((colIdx / binCount) * 100) + xOffset;

      const heightIdx = counts[colIdx];
      const y = yScale(heightIdx);

      positions[rowIdx] = { row, x, y, val };

      rowIdx += 1;
      counts[colIdx] -= 1;
    }
    return { xScale, yScale, positions, minHeight, minWidth };
  }
);

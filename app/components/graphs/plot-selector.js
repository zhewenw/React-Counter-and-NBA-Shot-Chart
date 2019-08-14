import { createSelector } from 'reselect';
import { mean, percent } from './utils';

function getScales(rows) {
  const xScale = percent(rows, r => r.x);
  const yScale = percent(rows, r => r.y);
  return { xScale, yScale, rows };
}

const transformSelector = createSelector(
  props => props.x,
  props => props.y,
  props => props.data,
  (x, y, data) => data.map(row => ({ x: x(row), y: y(row), row }))
);

const scaleSelector = createSelector(
  transformSelector,
  getScales
);

export default scaleSelector;

export const linearRegressionSelector = createSelector(
  scaleSelector,
  linearRegression
);

function linearRegression(scales) {
  const { xScale, yScale, rows } = scales;
  const data = rows.map(r => ({ x: xScale(r.x), y: yScale(r.y) }));
  const xMean = mean(data, r => r.x);
  const yMean = mean(data, r => r.y);
  const covariance = mean(data, r => r.x * r.y) - (xMean * yMean);
  const xVariance = mean(data, r => r.x * r.x) - (xMean * xMean);
  const yVariance = mean(data, r => r.y * r.y) - (yMean * yMean);
  const varDiff = yVariance - xVariance;
  const a = (Math.sqrt((varDiff * varDiff) + (4 * covariance * covariance))
    + varDiff) / (2 * covariance);
  const b = yMean - (a * xMean);

  return { a, b };
}

import { createSelector } from 'reselect';

export default createSelector(
  props => props.data,
  props => props.x,
  (rows, xFn) => {
    const sorted = rows.sort((a, b) => xFn(a) - xFn(b));
    const median = calculateMedian(sorted, xFn);
    const mode = calculateMode(sorted, xFn);
    const mean = calculateMean(sorted, xFn);

    // calculate sd, outliers, and quartiles
    // also assume an outlier is 3sd and over, whatever it is
    const sd = calculateSD(sorted, xFn);
    const outliers = calculateOutliers(sorted, xFn);
    const firstQuart = calculateQuartile(sorted, 1, xFn);
    const thirdQuart = calculateQuartile(sorted, 3, xFn);
    return { mean, median, mode, firstQuart, thirdQuart, sd, outliers };
  }
);

function calculateMedian(sorted, xFn) {
  const median = Math.floor(sorted.length / 2.00);
  if (sorted.length % 2 === 0) {
    return xFn(sorted[median]);
  }
  return (((xFn(sorted[median - 1])) + xFn(sorted[median])) / 2.0);
}

function calculateMode(sorted, xFn) {
  if (sorted.length === 0) {
    return null;
  }

  const modeMap = {};
  let maxCount = 1;
  let mode = xFn(sorted[0]);

  for (let i = 0; i < sorted.length; i += 1) {
    const currentVal = xFn(sorted[i]).toFixed(2);
    if (modeMap[currentVal] === undefined) {
      modeMap[currentVal] = 1;
    }
    modeMap[currentVal] += 1;
    if (modeMap[currentVal] > maxCount) {
      mode = currentVal;
      maxCount = modeMap[currentVal];
    }
  }
  return mode;
}

function calculateMean(sorted, xFn) {
  let total = 0;
  let mean = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    total += xFn(sorted[i]);
  }
  mean = total / sorted.length;
  return mean;
}

function calculateSD(sorted, xFn) {
  const mean = calculateMean(sorted, xFn);
  let sum = 0;
  let sd = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    sum += xFn(sorted[i]) - mean;
  }
  sd = Math.sqrt(sum / (sorted.length - 1));
  return sd;
}

function calculateOutliers(sorted, xFn) {
  const outliers = [];
  const mean = calculateMean(sorted, xFn);
  const sd = calculateSD(sorted, xFn);
  for (let i = 0; i < sorted.length; i += 1) {
    if (xFn(sorted[i]) >= (mean + (sd * 3.0))) {
      outliers.push(xFn(sorted[i]));
    }
  }
  return outliers;
}

function calculateQuartile(sorted, quadrant, xFn) {
  const quartileVal = Math.floor((sorted.length / 4.00) * quadrant);
  if (quartileVal % 2 === 0) {
    return xFn(sorted[quartileVal]);
  }
  return ((xFn(sorted[quartileVal - 1]) +
    xFn(sorted[quartileVal])) / 2.00);
}

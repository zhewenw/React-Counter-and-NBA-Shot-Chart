import { scaleLinear } from 'd3-scale';

const pad = (min, max) => (max - min) / 20;

export function minMax(vals, fn) {
  let min = Infinity;
  let max = -Infinity;

  for (const val of vals) {
    const actual = fn(val);
    if (max < actual) max = actual;
    if (min > actual) min = actual;
  }

  return { min, max };
}

export function mean(vals, fn) {
  return vals.map(fn).reduce((a, b) => a + b, 0) / vals.length;
}

export function percent(vals, fn) {
  const { min, max } = minMax(vals, fn);
  const padding = pad(min, max);

  return scaleLinear()
    .domain([min - padding, max + padding])
    .range([0, 100]);
}

export function bins(rows, fn, binCount) {
  const { min, max } = minMax(rows, fn);
  const padding = pad(min, max);

  const binner = scaleLinear()
    .domain([min - padding, max + padding])
    .range([0, binCount]);

  // array of counts
  const counts = Array(...Array(binCount)).map(() => 0);
  for (const row of rows) {
    const val = fn(row);
    const idx = Math.floor(binner(val));
    counts[idx] += 1;
  }

  const xScale = scaleLinear()
    .domain([min - padding, max + padding])
    .range([0, 100]);
  const yScale = scaleLinear()
    .domain([0, Math.max(...counts)])
    .range([0, 100]);

  // array of y positions
  const cols = counts.map(yScale);
  return { binner, xScale, yScale, cols, counts };
}

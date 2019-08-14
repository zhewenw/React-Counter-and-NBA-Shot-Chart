import { createSelector } from 'reselect';

export default createSelector(
  props => props.a,
  props => props.b,

  (a, b) => {
    const leftEndpoint = b >= 0 ? [0, b] : [(-b / a), 0];
    const rightEndpoint = findRightEndpoint(a, b);
    const height = distance(leftEndpoint, rightEndpoint);

    const midpointX = (leftEndpoint[0] + rightEndpoint[0]) / 2;
    const midpointY = (leftEndpoint[1] + rightEndpoint[1]) / 2;

    // The top aspect starts at 0% at the top of the graph to 100% to the bottom
    // of the graph
    // It sets the location of the topmost location of the unrotated line.
    const topY = 100 - (midpointY + (height / 2));

    // Angle in degrees from the y-axis
    const angle = Math.atan(1 / a) * (180 / Math.PI);

    return { height, left: midpointX, top: topY, angle };
  }
);

function findRightEndpoint(a, b) {
  if (a === 0) {
    return [100, b];
  }

  // Y and X should be in [0, 100]. Find x, y s.t. we don't defy these maxes
  const xAtYLim = a > 0 ? (100 - b) / a : (-b / a);
  const rightX = Math.min(xAtYLim, 100);

  return [rightX, (a * rightX) + b];
}

function distance(first, second) {
  const xDiff = second[0] - first[0];
  const yDiff = second[1] - first[1];
  return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
}

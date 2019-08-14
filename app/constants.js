const graphTypes = ['plot', 'histogram', 'discreteHistogram', 'shotChartMap'];

export default {
  statNames: ['FGA', 'eFG', 'qSQ', 'qSI'],
  oddTeamAbbreviations: {
    NOP: 'NO',
    UTA: 'UTH',
  },
  graphTypes,
  actualGraphs: graphTypes.slice(0, 3),
};

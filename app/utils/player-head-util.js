const headshotEndpoint = 'http://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/';
const headshotMissingEndpoint = 'http://stats.nba.com/media/img/no-headshot_large.png';
export default function getPlayerHeadURL(id) {
  // const nbaId = player.nbaId;
  if (id) {
    return `${headshotEndpoint}${id}.png`;
  }
  return headshotMissingEndpoint;
}

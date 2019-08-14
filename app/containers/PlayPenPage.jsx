import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PlayPen from '../components/PlayPen';
import * as playPenActions from '../actions/playpenActions';

function mapStateToProps(state) {
  // state.get('dataReducer') gets the state from the reducer in data.js.
  // state.get('routing') would get the state from the reducer in router.js
  const dataReducerState = state.get('dataReducer');
  return {
    xVal: dataReducerState.xVal,
    yVal: dataReducerState.yVal,
    bins: dataReducerState.bins,
    minShots: dataReducerState.minShots,
    dataView: dataReducerState.dataView,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(playPenActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayPen);

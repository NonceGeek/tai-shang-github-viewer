import { combineReducers } from 'redux'
import defaultState from './state.js'

function accessToken (state = defaultState.accessToken, action) {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      return action.data
    default:
      return state
  }
}

function issueOpenCount (state = defaultState.issueOpenCount, action) {
  switch (action.type) {
    case 'SET_ISSUE_OPEN_COUNT':
      return action.data
    default:
      return state
  }
}

function issueClosedCount (state = defaultState.issueClosedCount, action) {
  switch (action.type) {
    case 'SET_ISSUE_CLOSED_COUNT':
      return action.data
    default:
      return state
  }
}

export default combineReducers({
  accessToken,
  issueOpenCount,
  issueClosedCount,
})
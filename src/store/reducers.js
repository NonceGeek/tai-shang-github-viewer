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

export default combineReducers({
  accessToken,
})
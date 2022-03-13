
export function setAccessToken(data) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_ACCESS_TOKEN', data: data })
  }
}


export function setIssueOpenCount(data) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_ISSUE_OPEN_COUNT', data: data })
  }
}

export function setIssueClosedCount(data) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_ISSUE_CLOSED_COUNT', data: data })
  }
}
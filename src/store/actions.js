
export function setAccessToken (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_ACCESS_TOKEN', data: data })
  }
}

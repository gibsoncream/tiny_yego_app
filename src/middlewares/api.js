import axios from 'axios';

export const api = store => next => action => {
  if (!action.api) return next(action);

  const { api } = action;

  const method = api.method || 'GET';
  const params = api.body;
    
  const headers = {
    "Content-Type": "application/json"
  }

  next({
    type: `${action.type}_LOADING`
  })

  axios(api.url, {
    method,
    headers,
    params
  })
    .then(res => res.data)
    .then(data => {
      store.dispatch({
        type: `${action.type}_SUCCESS`,
        data
      });
    })
    .catch(error => {
      store.dispatch({
        type: `${action.type}_FAILURE`,
        error
      });
    });
}
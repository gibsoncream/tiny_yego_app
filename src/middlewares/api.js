import axios from 'axios';

export const api = store => next => action => {
  if (!action.api) return next(action);

  const { api } = action;

  const method = api.method || 'GET';
  // // const body = api.body ? JSON.stringify(api.body) : undefined;
  // const params2 = api.body;
  // console.log('22222222222222', params2)
    
    const headers = {
      "Content-Type": "application/json"
    }
    
    const params = {
      "api_token": "GI58lTEb98VvjzUFnrnMJuehn5E8PA6LX8bGNgLmNq2CVaUnIZqCyLWmcgHk"
    }
    // console.log('UAAAAAAAAA', params)

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
      console.log('Failing', error)
      store.dispatch({
        type: `${action.type}_FAILURE`,
        error
      });
    });
}
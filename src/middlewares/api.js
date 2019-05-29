
export const api = store => next => action => {
  if (!action.api) return next(action);

  const { api } = action;
  console.log('API', api)

  // const method = api.method || 'GET';
  // // const body = api.body ? JSON.stringify(api.body) : undefined;
  // // const body = JSON.stringify(api.body);
  const token = {
    api_token: "GI58lTEb98VvjzUFnrnMJuehn5E8PA6LX8bGNgLmNq2CVaUnIZqCyLWmcgHk"
  } 
  // const headers = {
  //   'Content-Type': 'application/json'
  // }

  next({
    type: `${action.type}_LOADING`
  })

  fetch(api.url, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(token),
  })
    .then(res => {
      console.log('HEY', res)
      return res.json()})
    .then(data => {
      console.log('UUUUU', data)
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
import {
  applyMiddleware,
  createStore,
  compose
} from 'redux'
//import thunk from 'redux-thunk' was put into create store with middleware
import lodash from 'lodash'

import reducers from './reducers'
import {
  createAsyncStorageMiddleware,
  getCachedState
} from './middlewares/AsyncStorageMiddleware'

import { api } from './middlewares/api';

const blacklistedKeys = []

export default async function() {
  const cachedState = lodash.omit(await getCachedState(), blacklistedKeys)
  const createStoreWithMiddleware = applyMiddleware(
    createAsyncStorageMiddleware(blacklistedKeys),
    api
  )(createStore);

  return createStoreWithMiddleware(reducers, cachedState);
}

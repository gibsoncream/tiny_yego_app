import {
  applyMiddleware,
  createStore,
} from 'redux'
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

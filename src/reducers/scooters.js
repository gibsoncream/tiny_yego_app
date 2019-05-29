import * as ActionTypes from '../actions/scooterTypes';

const initialState = {
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case `${ActionTypes.GET_SCOOTERS}_SUCCESS`:
      console.log('HERE')
      return {
        ...state,
        ...action.data,
        loading: false
      } 
      case `${ActionTypes.GET_SCOOTERS}_FAILURE`:
        return {
          ...state,
          ...action.error,
          loading: false
        }
        case `${ActionTypes.GET_SCOOTERS}_LOADING`:
          return {
        ...state,
        loading: true
      }
      default:
      return state
  }
}
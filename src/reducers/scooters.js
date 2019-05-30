import * as ActionTypes from '../actions/scooterTypes';

export default (state = null, action) => {
  switch (action.type) {
    case `${ActionTypes.GET_SCOOTERS}_SUCCESS`:
      console.log('LOOOGI', action.data)
      return {
        ...state,
        yegos: [...action.data],
        loading: false
      } 
      case `${ActionTypes.GET_SCOOTERS}_FAILURE`:
        return {
          ...state,
          errors: [...state.errors, ...action.error],
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
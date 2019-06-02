import * as ActionTypes from '../actions/scooterTypes';

export default (state = null, action) => {
  switch (action.type) {
    case `${ActionTypes.GET_SCOOTERS}_SUCCESS`:
      return {
        ...state,
        yegos: [...action.data],
        loading: false
      } 
      case `${ActionTypes.GET_SCOOTERS}_FAILURE`:
        return {
          ...state,
          errors: action.error,
          loading: false
        }
        case `${ActionTypes.GET_SCOOTERS}_LOADING`:
          return {
            ...state,
            loading: true
          }
          case `${ActionTypes.SET_USER_LOCATION}`:
        console.log('LOOOGI', action.userLocation)
        return {
          ...state,
          userLocation: {
            latitude: action.userLocation[0].latitude,
            longitude: action.userLocation[0].longitude
          }
        }
      default:
      return state
  }
}
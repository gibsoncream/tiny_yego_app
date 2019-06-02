import * as ActionTypes from './scooterTypes';
import Config from 'react-native-config';

export const getScooters = () => ({
    type: ActionTypes.GET_SCOOTERS,
    api: {
      url: Config.API_URL,
      body: {
        api_token: Config.API_TOKEN
      }
    }
  })

export const setUserLocation = (userLocation) => ({
    type: ActionTypes.SET_USER_LOCATION,
    userLocation
  })
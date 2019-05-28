import React, { useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid } from 'react-native';
import RNLocation from 'react-native-location';
import MapView from 'react-native-maps';
import { Provider } from 'react-redux';


import configureStore from './src/configureStore';
import { makeCancelable } from './static/misc/utils';
import AppContainer from './src/containers/AppContainer';

const styles = StyleSheet.create({
  map: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const YegoTiny = (props) => {

  useEffect(() => {
    RNLocation.configure({
      distanceFilter: 5.0
    })

    RNLocation.requestPermission({
      android: {
        detail: "fine"
      }
    }).then(granted => {
      if (granted) {
        console.log('Im here')
        const loc = RNLocation.subscribeToLocationUpdates(locations => console.log('LOCI', locations))
      }
    })

    // RNLocation.checkPermission({
    //   android: {
    //     detail: "fine"
    //   }
    // })

    // const granted = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(granted => {
    //   if (granted) {
    //     console.log('USE IT')
    //   } else {
    //     console.log('GO AWAY')
    //   }
    // })
    
  }, []);

    // if (this.state.store) {
      return (
        // <Provider store={this.state.store}>
          // <AppContainer/>
        // </Provider>
        // <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
        // <Text>Hi, i now work</Text>
        // </View>
        <MapView
        style={styles.map}
        showsUserLocation={true}
     />
      )
}
    // return null

export default YegoTiny
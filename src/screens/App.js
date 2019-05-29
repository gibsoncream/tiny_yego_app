import React, { useEffect } from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import MapView from 'react-native-maps';
import RNLocation from 'react-native-location';
import { connect } from 'react-redux'
import * as Actions from '../actions/index';

const App = (props) => {

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
        const loc = RNLocation.subscribeToLocationUpdates(locations => console.log('LOCI', locations))
      }
    })
  }, []);

  useEffect(() => {
    props.getScooters();
  }, []);

    return (
      <MapView
        style={styles.map}
        region={{
          latitude: 41.388998444,
          longitude: 2.13999944,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
          }}
        showsUserLocation={true}
     />
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  iconApp: {
    height: 150,
    width: 150
  },
  map: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapDispatchToProps = { getScooters: Actions.getScooters };

export default connect(null, mapDispatchToProps)(App);

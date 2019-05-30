import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import RNLocation from 'react-native-location';
import { connect } from 'react-redux'
import * as Actions from '../actions/index';

const App = (props) => {

  // useEffect(() => {
  //   RNLocation.configure({
  //     distanceFilter: 5.0
  //   })

  //   RNLocation.requestPermission({
  //     android: {
  //       detail: "fine"
  //     }
  //   }).then(granted => {
  //     if (granted) {
  //       const loc = RNLocation.subscribeToLocationUpdates(locations => console.log('LOCI', locations))
  //     }
  //   })
  // }, []);

  
  useEffect(() => {
    props.getScooters();
  }, []);
  
  const myScreenHeight = Math.round(Dimensions.get('window').height);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    map: {
      position: 'absolute',
      flex: 4,
      top: 0,
      left: 0,
      right: 0,
      bottom: 200
    },
    bottomView: {
      flex: 2,
      top: myScreenHeight - 200,
      left: 0,
      right: 0,
      bottom: 0
    }
  });
  
    return (
      <View style={styles.container}>
      <MapView
      style={styles.map}
        region={{
          latitude: 41.388998444,
          longitude: 2.13999944,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
          }}
        showsUserLocation={true}
        >
          {props.scooters.map((scooter, i) => {
            return (
              <Marker key={i}
              color={"red"}
              coordinate={{
                latitude: scooter.lat,
                longitude: scooter.lng
              }}
              />
              )
            })}
        </MapView>
        <View style={styles.bottomView}>
          <Text>Hello</Text>
        </View>
        </View>
    );
}

const mapStateToProps = state => ({
    scooters: state.scooters.yegos
});

const mapDispatchToProps = { getScooters: Actions.getScooters };

export default connect(mapStateToProps, mapDispatchToProps)(App);

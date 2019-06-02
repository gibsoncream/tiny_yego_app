import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getDistance } from 'geolib';
import RNLocation from 'react-native-location';
import { connect } from 'react-redux'
import * as Actions from '../actions/index';
import OrangePin from '../pins/orangePin.png';
import RedPin from '../pins/redPin.png';
import BluePin from '../pins/bluePin.png';
import BlackPin from '../pins/blackPin.png';

const App = (props) => {

  const [details, setDetails] = useState({});

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
        RNLocation.subscribeToLocationUpdates(location => props.setUserLocation(location));
      };
    });
  }, []);

  
  useEffect(() => {
    props.getScooters();
  }, []);

  const setter = (e, yego) => {
    console.log('E', e)
    e.stopPropagation();
    e.preventDefault();
    setDetails(yego);
  };
  
  const myScreenHeight = Math.round(Dimensions.get('window').height);

  const pinColorChecker = (scooter) => {
    if (scooter.status === 0) return OrangePin;
    else if (scooter.status === 1) return BlackPin;
    else return RedPin;
  };

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
    },
    name: {
      fontSize: 50,
      fontWeight: 'bold',
    },
    battery: {
      fontSize: 40
    }
  });

  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
      initialRegion={{
        latitude: 41.388998444,
        longitude: 2.13999944,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
        showsUserLocation={true}
        loadingEnabled={true}
        >
          {props.scooters.map((scooter, i) => {
            return (
              <Marker key={i}
              icon={pinColorChecker(scooter)}
              coordinate={{
                latitude: scooter.lat,
                longitude: scooter.lng
              }}
              onPress={(e) => setter(e, scooter)}
              />
              )
            })}
        </MapView>
        <View style={styles.bottomView}>
          <Text style={styles.name}>{details.name}</Text>
          <Text style={styles.battery}>{details.battery}</Text>
          <Text style={styles.battery}>{details.distanceFromUser}</Text>
        </View>
        </View>
    );
  }

const mapStateToProps = state => {
  const userLocation = state.scooters.userLocation;
  const scooters = state.scooters.yegos;
    scooters.forEach(scooter => {
      scooter.distanceFromUser = getDistance(
        {latitude: userLocation.latitude, longitude: userLocation.longitude},
        {latitude: scooter.lat, longitude: scooter.lng} 
        )
    })
  return {
    scooters: scooters
  }
};

const mapDispatchToProps = { 
  getScooters: Actions.getScooters,
  setUserLocation: Actions.setUserLocation
 };

export default connect(mapStateToProps, mapDispatchToProps)(App);

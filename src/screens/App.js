import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
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
  const [mapRegion, setMapRegion] = useState({});

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
        RNLocation.subscribeToLocationUpdates(location => {
          props.setUserLocation(location)
          setMapRegion({
            latitude: 41.388998444,
            longitude: 2.13999944,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          })
        });
      };
    });
  }, []);

  
  useEffect(() => {
    props.getScooters();
    setDetails(props.scooters[0])
  }, []);
  
  const selectScooter = (e, scooter) => {
    e.stopPropagation();
    e.preventDefault();
    if (scooter.status === 0) {
      setDetails(scooter)
      setMapRegion({
        latitude: scooter.lat,
        longitude: scooter.lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      })
    } else return null;
  };
  

  const pinColorChecker = (scooter) => {
    if (scooter.status === 0) return OrangePin;
    else if (scooter.status === 1) return BlackPin;
    else return RedPin;
  };

  const setOnUser = () => {
    setMapRegion({
      latitude: props.userLocation.latitude,
      longitude: props.userLocation.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    })
  };

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
      bottom: 0,
      flexDirection: 'row',
    },
    name: {
      fontSize: 50,
      fontWeight: 'bold',
    },
    battery: {
      fontSize: 40
    },
    buttons: {
      flex: 1,
      justifyContent: 'space-around',
      width: 10,
      height: 150,
    }
  });

  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
      region={mapRegion}
      showsUserLocation={true}
      loadingEnabled={true}
        >
          {props.scooters.map((scooter, i) => {
            return (
              <Marker key={i}
              icon={details.id === scooter.id ? BluePin : pinColorChecker(scooter)}
              coordinate={{
                latitude: scooter.lat,
                longitude: scooter.lng
              }}
              onPress={(e) => selectScooter(e, scooter)}
              />
              )
            })}
        </MapView>
        <View style={styles.bottomView}>
          <View style={styles.buttons}>
          <Button 
          title="Previous yego"/>
          <Button 
          title="Recenter map"
          onPress={() => setOnUser()}
          />
          </View>
          <View>
          <Text style={styles.name}>{details.name}</Text>
          <Text style={styles.battery}>{details.battery}</Text>
          <Text style={styles.battery}>{details.distanceFromUser}</Text>
          </View>
          <View style={styles.buttons}>
          <Button
          title="Next yego" />
          <Button
          title="Refresh yegos"
          onPress={() => props.getScooters()}
          />
          </View>
        </View>
        </View>
    );
  };

const mapStateToProps = state => {
  const userLocation = state.scooters.userLocation;
  const scooters = state.scooters.yegos;
    scooters
      .forEach(scooter => {
      scooter.distanceFromUser = getDistance(
        {latitude: userLocation.latitude, longitude: userLocation.longitude},
        {latitude: scooter.lat, longitude: scooter.lng} 
        )
    });
    scooters.sort((a, b) => a.distanceFromUser - b.distanceFromUser);
  return {
    userLocation: state.scooters.userLocation,
    scooters: scooters,
    selectedYego: scooters[0]
  }
};

const mapDispatchToProps = { 
  getScooters: Actions.getScooters,
  setUserLocation: Actions.setUserLocation
 };

export default connect(mapStateToProps, mapDispatchToProps)(App);

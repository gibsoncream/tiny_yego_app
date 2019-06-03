import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getDistance } from 'geolib';
import RNLocation from 'react-native-location';
import { connect } from 'react-redux';

import * as Actions from '../actions/index';
import OrangePin from '../utils/pins/orangePin.png';
import RedPin from '../utils/pins/redPin.png';
import BluePin from '../utils/pins/bluePin.png';
import BlackPin from '../utils/pins/blackPin.png';

const App = ({ userLocation, scooters, availableScooters, getScooters, setUserLocation }) => {
  
  const [selectedScooter, setSelectedScooter] = useState({});
  const [mapRegion, setMapRegion] = useState({});
  const [goForward, setGoForward] = useState(true);
  const [goBackwards, setGoBackwards] = useState(true);

  useEffect(() => {
    RNLocation.configure({
      distanceFilter: 5.0
    });
    RNLocation.requestPermission({
      android: {
        detail: 'fine'
      }
    }).then(granted => {
      if (granted) {
        RNLocation.subscribeToLocationUpdates(location => {
          setUserLocation(location);
          setMapRegion({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          });
        });
      }
    });
  }, []);

  useEffect(() => {
    refreshScooters();
  }, []);

  const setRegionOnMap = (lat, lng) => {
    setMapRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    });
  };

  const selectScooter = (e, scooter) => {
    e.stopPropagation();
    e.preventDefault();
    if (scooter.status === 0) {
      setSelectedScooter(scooter);
      setRegionOnMap(scooter.lat, scooter.lng);
    }
  };

  const pinColorSetter = scooter => {
    if (scooter.status === 0) return OrangePin;
    else if (scooter.status === 1) return BlackPin;
    else return RedPin;
  };

  const refreshScooters = () => {
    getScooters();
    setSelectedScooter(availableScooters[0]);
    setRegionOnMap(availableScooters[0].lat, availableScooters[0].lng);
  };

  const selectNextScooter = direction => {
    let index = availableScooters
      .map(scooter => scooter.id)
      .indexOf(selectedScooter.id);
    if (direction === 'back') {
      if (availableScooters[index - 1]) {
        setSelectedScooter(availableScooters[index - 1]);
        setRegionOnMap(
          availableScooters[index - 1].lat,
          availableScooters[index - 1].lng
        );
        setGoForward(true);
      } else setGoBackwards(false);
    }
    if (direction === 'forward')
      if (availableScooters[index + 1].distanceFromUser < 1200) {
        setSelectedScooter(availableScooters[index + 1]);
        setRegionOnMap(
          availableScooters[index + 1].lat,
          availableScooters[index + 1].lng
        );
        setGoBackwards(true);
      } else setGoForward(false);
  };

  const setOnUser = () => {
    setMapRegion({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    });
  };

  const myScreenHeight = Math.round(Dimensions.get('window').height);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
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
      flexDirection: 'row'
    },
    name: {
      fontSize: 50,
      fontWeight: 'bold'
    },
    battery: {
      fontSize: 40
    },
    buttons: {
      flex: 1,
      justifyContent: 'space-around',
      width: 10,
      height: 150
    }
  });

  return (
    <View style={styles.container}>
      {mapRegion.latitude && (
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          loadingEnabled={true}
        >
          {scooters.map((scooter, i) => {
            return (
              <Marker
                key={i}
                icon={
                  selectedScooter.id === scooter.id
                    ? BluePin
                    : pinColorSetter(scooter)
                }
                coordinate={{
                  latitude: scooter.lat,
                  longitude: scooter.lng
                }}
                onPress={e => selectScooter(e, scooter)}
              />
            );
          })}
        </MapView>
      )}
      <View style={styles.bottomView}>
        <View style={styles.buttons}>
          <Button
            title="Previous yego"
            onPress={() => selectNextScooter('back')}
            disabled={goBackwards ? false : true}
          />
          <Button title="Recenter map" onPress={() => setOnUser()} />
        </View>
        <View>
          <Text style={styles.name}>{selectedScooter.name}</Text>
          <Text style={styles.battery}>{selectedScooter.battery}</Text>
          <Text style={styles.battery}>{selectedScooter.distanceFromUser}</Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title="Next yego"
            disabled={goForward ? false : true}
            onPress={() => selectNextScooter('forward')}
          />
          <Button title="Refresh yegos" onPress={() => refreshScooters()} />
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  const userLocation = state.scooters.userLocation;
  const scooters = state.scooters.yegos;
  scooters.forEach(scooter => {
    scooter.distanceFromUser = getDistance(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      { latitude: scooter.lat, longitude: scooter.lng }
    );
  });
  scooters.sort((a, b) => a.distanceFromUser - b.distanceFromUser);
  const availableScooters = scooters.filter(scooter => scooter.status === 0);
  return {
    userLocation: state.scooters.userLocation,
    scooters: scooters,
    availableScooters: availableScooters
  };
};

const mapDispatchToProps = {
  getScooters: Actions.getScooters,
  setUserLocation: Actions.setUserLocation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

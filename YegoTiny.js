import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

class YegoTiny extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.configureStore = makeCancelable(configureStore());
    this.configureStore.promise.then(store => {
      this.setState({store});
    }).catch(e => console.warn("configureStore canceled:", e && e.message ? e.message : e));
  }

  componentWillUnmount() {
    if (this.configureStore) this.configureStore.cancel();
  }

  render() {
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
    initialRegion={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
   />
      )
    }
    // return null
  }

export default YegoTiny
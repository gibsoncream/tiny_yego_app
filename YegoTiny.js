import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './src/configureStore';
import { makeCancelable } from './static/misc/utils';
import AppContainer from './src/containers/AppContainer';

class YegoTiny extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.configureStore = makeCancelable(configureStore());
    this.configureStore.promise.then(store => {
      this.setState({store});
    }).catch(e => console.warn("configureStore cancelled:", e && e.message ? e.message : e));
  }

  componentWillUnmount() {
    if (this.configureStore) this.configureStore.cancel();
  }

  render() {
    if (this.state.store) {
      return (
        <Provider store={this.state.store}>
          <AppContainer/>
        </Provider>
      )
    }
    return null
  }
}

export default YegoTiny

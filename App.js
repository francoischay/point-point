import React from 'react';
import { AsyncStorage, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import Navigator from './navigation/Navigator';
import Podda from 'podda';

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  constructor(){
    super();

    this.state = { 
      players: [
        /*{
          id: 0,
          icon: '😀',
          name: 'Nom 1',
          score: 0,
          log: []
        },
        {
          id: 1,
          icon: '😂',
          name: 'Nom 2',
          score: 0,
          log: []
        },
        {
          id: 2,
          icon: '😂',
          name: 'Nom 3',
          score: 100,
          log: []
        }*/
      ],
      order: [/*'0', '1', '2'*/]
    };

    this.store = new Podda();

    this.store.set("players", this.state.players)
    this.stopPlayersWatch = this.store.watch('players', (_data) => {
      this.setState({players: _data})
    });

    this.store.set("order", this.state.order);

    this.retrievePlayers().then((_players)=>{
      this.store.set("previousNames", _players)
    }).catch((_error)=>{
      console.log(_error)
    })
  }

  retrievePlayers = async () => {
    try {
      const retrievedPlayers = await AsyncStorage.getItem('previousNames');
      retrievedPlayers= retrievedPlayers.split(",");
      
      return retrievedPlayers;
    } catch (_error) {
      console.log(_error.message);
    }
    return;
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Navigator screenProps={{ store: this.store }} />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {  
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

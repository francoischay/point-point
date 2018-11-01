import React from 'react';
import { AsyncStorage, Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import Podda from 'podda';
import EStyleSheet from 'react-native-extended-stylesheet';
import Emojis from './constants/Emojis';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import Navigator from './navigation/Navigator'

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  constructor(){
    super();

    //AsyncStorage.clear()
    
    EStyleSheet.build({
      $rem: Dimensions.get('window').width > 375 ? 18 : 12
    });

    this.state = { 
      players: [],
      order: [],
      previousNames: [],
      rankByLessPoints: false
    };

    this.store = new Podda();
    this.store.registerAPI('updatePlayer', (_store, _playerId, _key, _value) => {
      const players = _store.get('players');
      const index = players.findIndex(x => x.id==_playerId);
      const newPlayer = players[index]

      newPlayer[_key] = _value;

      // Insure log and score are always in sync
      if(_key === "log"){
        const log = newPlayer.log;
        let total = 0;
        for (let i = 0; i < log.length; i++) {
          total += log[i].points
        }
        newPlayer.score = total;
      }

      players[index] = newPlayer;

      _store.set('players', players);

      return _store.get('players')[index];
    });

    this.store.registerAPI('getPlayerLog', (_store, _playerId) => {
      return _store.get('players')[_playerId].log
    })

    this.store.set("players", this.state.players)

    this.stopPlayersWatch = this.store.watch('players', (_playersToSave) => {
      const playersToSaveString = JSON.stringify(_playersToSave);
      AsyncStorage.setItem("currentPlayers", playersToSaveString)
      this.setState({players: _playersToSave})
    }); 

    this.store.set("order", this.state.order);
    this.stopOrderWatch = this.store.watch('order', (_orderToSave) => {
      const orderToSaveString = JSON.stringify(_orderToSave);
      AsyncStorage.setItem("order", orderToSaveString)
    }); 
    
    this.stopPreviousNameWatch = this.store.watch('previousNames', (_playersNameToSave) => {
      const playersNameToSaveString = (_playersNameToSave === undefined)? "" : _playersNameToSave.toString();
      AsyncStorage.setItem("previousNames", playersNameToSaveString)
      this.setState({"previousNames": _playersNameToSave})
    })

    this.stopRankingOrderWatch = this.store.watch('rankByLessPoints', (_rankByLessPoints) => {
      console.log("WATCH", _rankByLessPoints)
      AsyncStorage.setItem("rankByLessPoints", _rankByLessPoints.toString())
      this.setState({"rankByLessPoints": _rankByLessPoints})
    })

    this.retrievePlayers().then((_players)=>{
      const players = (_players === null) ? [] : _players;
      this.store.set("players", players)
    })

    this.retrieveOrder().then((_order)=>{
      const order = (_order === null) ? [] : _order;
      this.store.set("order", order)
    })

    this.retrievePreviousNames().then((_previousNames)=>{
      this.store.set("previousNames", _previousNames)
    })

    this.retrieveRankingOrder().then((_rankByLessPoints:Boolean)=>{
      console.log("RETRIEVE 1", _rankByLessPoints)
      _rankByLessPoints = _rankByLessPoints === "true" ? true : false;
      console.log("RETRIEVE 2", _rankByLessPoints)
      this.store.set("rankByLessPoints", _rankByLessPoints)
    })
  }

  retrievePlayers = async () => {
    try {
      const retrievedPlayers = await AsyncStorage.getItem('currentPlayers');
      
      return JSON.parse(retrievedPlayers);
    } 
    catch (_error) {
      console.log("No existing players");
    }
    return;
  }

  retrieveOrder = async () => {
    try {
      const retrievedOrder = await AsyncStorage.getItem('order');
      
      return JSON.parse(retrievedOrder);
    } 
    catch (_error) {
      console.log("No existing order");
    }
    return;
  }

  retrievePreviousNames = async () => {
    try {
      const retrievedPreviousNames = await AsyncStorage.getItem('previousNames');
      retrievedPreviousNames= retrievedPreviousNames.split(",");
      
      return retrievedPreviousNames;
    } 
    catch (_error) {
      console.log("No existing players names");
    }
    return;
  }

  retrieveRankingOrder = async () => {
    try {
      const retrievedRankingOrder = await AsyncStorage.getItem('rankByLessPoints');
      return retrievedRankingOrder;
    } 
    catch (_error) {
      console.log("No ranking order");
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
        <ActionSheetProvider>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <Navigator screenProps={{ store: this.store }} />
          </View>
        </ActionSheetProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {  
    return Promise.all([
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

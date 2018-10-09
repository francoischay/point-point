import React from 'react';
import { AsyncStorage, Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import Navigator from './navigation/Navigator';
import Podda from 'podda';
import EStyleSheet from 'react-native-extended-stylesheet';
import Emojis from './constants/Emojis';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  constructor(){
    super();
    
    EStyleSheet.build({
      $rem: Dimensions.get('window').width > 375 ? 18 : 12
    });

    this.state = { 
      players: [
        {
          id: 0,
          icon: {
            index: 0,
            item: Emojis[0]
          },
          name: 'Daniel',
          score: 0,
          log: []
        },
        {
          id: 1,
          icon: {
            index: 10,
            item: Emojis[10]
          },
          name: 'Lucienne',
          score: 0,
          log: []
        },
        {
          id: 2,
          icon: {
            index: 20,
            item: Emojis[20]
          },
          name: 'Jacqueline',
          score: 0,
          log: []
        }
      ],
      order: ['0', '1', '2']
    };

    this.store = new Podda();

    this.store.set("players", this.state.players)

    this.stopScreenWatch = this.store.watch('currentScreen', (_screenToSave) => {
      AsyncStorage.setItem("currentScreen", _screenToSave)
    }); 

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
      const playersNameToSaveString = _playersNameToSave.toString();
      AsyncStorage.setItem("previousNames", playersNameToSaveString)
      this.setState({"previousNames": _playersNameToSave})
    })

    this.retrievePlayers().then((_players)=>{
      const players = (_players.length > 0) ? _players : []; 
      this.store.set("players", players)
    })

    this.retrieveOrder().then((_order)=>{
      this.store.set("order", _order)
    })

    this.retrievePreviousNames().then((_previousNames)=>{
      this.store.set("previousNames", _previousNames)
    })

    this.retrieveCurrentScreen().then((_currentScreen)=>{
      this.store.set("currentScreen", _currentScreen)
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

  retrieveCurrentScreen = async () => {
    try {
      const retrievedScreen = await AsyncStorage.getItem('currentScreen');
      return retrievedScreen;
    } 
    catch (_error) {
      console.log("No previous Screen");
    }
    return;
  }

  render() {
    //AsyncStorage.clear();

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

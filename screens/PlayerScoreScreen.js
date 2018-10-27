import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Colors } from '../styles/Base';
import PlayerCard from '../components/PlayerCard'
import PlayerOptions from '../components/PlayerOptions'
import EStyleSheet from 'react-native-extended-stylesheet';

const defaultBackImage = require('../assets/images/back-icon-white.png');

export default class PlayerScoreScreen extends React.Component {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      playerId: this.props.navigation.state.params.id,
      showOptions: false,
      cardMarginLeft: new Animated.Value(Dimensions.get('window').width),
    }

    const players = this.props.screenProps.store.get("players");
    const order = this.props.screenProps.store.get("order");
    const gamePlayers = []
    let nextIndex;

    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < players.length; j++) {
        const player = players[j];
        if(player.id == order[i]) gamePlayers.push(player)
      }
    }

    for (let i = 0; i < gamePlayers.length; i++) {
      const player = gamePlayers[i];
      if(player.id === this.props.navigation.state.params.id){
        nextIndex = (gamePlayers[i + 1]) ? i+1 : 0;
      }
    }

    this.nextPlayer = gamePlayers[nextIndex];
  }

  componentDidMount() {
    this.show();
  }
  
  render() {
    const store = this.props.screenProps.store;

    return (
      <ScrollView style={{
        backgroundColor: Colors.GREEN,
        flex: 1
      }}>
        { this._renderHeader() }
        <Animated.View
          style={{
            marginLeft: this.state.cardMarginLeft,
            width: Dimensions.get('window').width
          }}
        >
          <PlayerCard 
            ref='PlayerCard'
            store={ store }
            data={ store.get("players")[this.state.playerId] }
            getLogFromStore={ this._getLogFromStore }
            callbackAfterUpdatingScore={ this._gotoNextPlayer }
          />
          <PlayerOptions 
            store={ store }
            playerId={ this.state.playerId }
            getLogFromStore={ this._getLogFromStore }
            onEliminatePress={ this._onEliminatePress }
            onEndOfTourPress={ this._onEndOfTourPress }
          />
        </Animated.View>
      </ScrollView>
    );
  }
  
  _renderHeader = () => {
    return (<View
      style={{
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      {this._renderLeftHeaderButton()}
      {this._renderRightHeaderButton()}
    </View>)
  }

  _renderLeftHeaderButton = () => {
    return (
      <TouchableOpacity 
        onPress={ this._goBack } 
        style={ styles.headerButtonContainer }
      >
        <Image
          style={ styles.icon }
          source={ defaultBackImage }
        />
        <Text
          style={ styles.headerButtonText }
        >
          Scores
        </Text>
      </TouchableOpacity>)
  }

  _renderRightHeaderButton = () => {
    return (
      <TouchableOpacity 
        onPress={ this._gotoNextPlayer } 
        style={ styles.headerButtonContainer }
      >
        <Text
          style={ styles.headerButtonText }
        >
          { this.nextPlayer.name }
        </Text>
        <Image
          style={ styles.iconBack }
          source={ defaultBackImage }
        />
      </TouchableOpacity>
    )
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _gotoNextPlayer = () => {
    this.hide()
  }

  _onEndOfTourPress = () => {
    this.props.navigation.navigate('PlayerDistributePoints', this.props.navigation.state.params)
  }

  _onEliminatePress = () => {
    const store = this.props.screenProps.store;
    const isEliminated = true;
    store.updatePlayer(this.state.playerId, "isEliminated", isEliminated)

    this.setState({
      showOptions: false,
      isEliminated: isEliminated
    })
  }

  _getLogFromStore = () => {
    const store = this.props.screenProps.store;
    const log = store.get('players')[this.state.playerId].log
    return log;
  }

  show = () => {
    Animated.timing(
      this.state.cardMarginLeft,
      {
        toValue: 0,
        duration: 500,
        easing: Easing.elastic()
      }
    ).start(() => {
      this.refs.PlayerCard.focusInput();
    });
  }

  hide = (_callback) => {
    Animated.timing(
      this.state.cardMarginLeft,
      {
        toValue: -Dimensions.get('window').width,
        duration: 250,
        easing: Easing.back()
      }
    ).start(() => {
      this.props.navigation.replace("PlayerScore", this.nextPlayer)
    })
  }
}

const styles = EStyleSheet.create({
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '1.5rem'
  },
  headerButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerButtonText: {
    color: 'white',
    fontSize: '1.25rem'
  },
  icon: {
    height: 21,
    width: 12,
    marginLeft: '1.5rem',
    marginRight: 6,
    marginVertical: 12,
    resizeMode: 'contain'
  },
  iconBack: {
    height: 21,
    width: 12,
    marginLeft: 6,
    marginRight: '1.5rem',
    marginVertical: 12,
    resizeMode: 'contain',
    transform: [{ scaleX: -1 }],
  },
  logList: {
    backgroundColor: 'white',
    borderRadius: 6,
    margin: '1.5rem',
    padding: '1.5rem',
  },
  logListItem: {
    fontSize: '1rem',
    paddingVertical: '0.75rem'
  }
})
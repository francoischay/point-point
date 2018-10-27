import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Base, Colors } from '../styles/Base';
import PPButton from '../components/PPButton'
import PPHoveringButton from '../components/PPHoveringButton'
import PlayerCard from '../components/PlayerCard'
import EStyleSheet from 'react-native-extended-stylesheet';
import { connectActionSheet } from '@expo/react-native-action-sheet';

const defaultBackImage = require('../assets/images/back-icon-white.png');

@connectActionSheet
export default class PlayerScoreScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
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
    const showOptionsLabel = this.state.showOptions ? "Cacher les options" : "Montrer les options" 

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
          <PPButton
            title={showOptionsLabel}
            onPress = {() => {
              this.setState({
                showOptions: !this.state.showOptions
              })
            }}
            color={'white'}
          />
          { this._renderOptions() }
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

  _renderOptions = () => {
    const log = this._getLogFromStore();
    const optionsStyles = (this.state.showOptions) ? {display: 'flex'} : {display: 'none'}
    
    return (
      <View style={optionsStyles}>
        <PPHoveringButton
          style= {{ 
            backgroundColor: 'white',
            marginBottom: 0
          }}
          color={ Colors.BLUE }
          title="Terminer un tour"
          onPress= {this._onEndOfTourPress}
        />
        <PPHoveringButton
          style= {[
            { 
              backgroundColor: 'white',
              marginBottom: 0
            }, 
            optionsStyles
          ]}
          color='red'
          title='Éliminer ce joueur'
          onPress= { this._onEliminatePress }
        />
        <FlatList
          style={[styles.logList, Base.SHADOW]}
          data={log}
          ListHeaderComponent = { this._renderLogListHeader }
          renderItem = {({item}) => this._renderLogItem(item)}
        />
      </View>
    )
  }

  _renderLogListHeader = () => {
    return (<View
        style={styles.headerContainer}
      >
        <Text
          style={ Base.HEADING_2 }
        >
          Historique
        </Text>
      </View>
    )
  }

  _renderLogItem = (_data) => {
    let time = new Date();
    time.setTime(_data.timestamp)
    
    const hours = ("0" + time.getHours()).slice(-2)
    const minutes = ("0" + time.getMinutes()).slice(-2)
    const seconds = ("0" + time.getSeconds()).slice(-2)
    const timeToDisplay = hours+":"+minutes+":"+seconds;

    return <TouchableOpacity 
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
      onPress={this._onLogItemPress.bind(this, _data)}
    >
      <Text style={styles.logListItem}>{ timeToDisplay }</Text> 
      <Text style={styles.logListItem}>{ _data.points }</Text> 
    </TouchableOpacity>
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

  _onLogItemPress = (_data) => {
    const log = this._getLogFromStore();
    let options = ['Supprimer cette entrée', 'Annuler', 'Annuler'];
    let destructiveButtonIndex = 0;
    let cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions({
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        title: 'Supprimer cette entrée ?',
        message: 'Le score sera recaculé'
      },
      buttonIndex => {
        if (buttonIndex === 0){
          const index = log.findIndex(x => x.timestamp==_data.timestamp);
          this._removeLogEntry(index);
        }
      });
  }

  _removeLogEntry = (_index) => {
    const store = this.props.screenProps.store;
    const log = this._getLogFromStore();
    log.splice(_index, 1)
    
    let player = store.updatePlayer(this.state.playerId, 'log', log)
    
    this.setState({
      score: player.score,
      scoreToDisplay: player.score,
      log: player.log
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
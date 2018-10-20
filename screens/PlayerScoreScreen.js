import React from 'react';
import {
    Dimensions,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { TextInput, FlatList } from '../node_modules/react-native-gesture-handler';
import { Base, Colors } from '../styles/Base';
import PPButton from '../components/PPButton'
import PPHoveringButton from '../components/PPHoveringButton'
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

    this.delay = 650;
    this.nbSteps = 20;

    this.state = {
      score: 0,
      scoreToDisplay: this.props.navigation.state.params.score,
      amount: '',
      amountToDisplay: '',
      playerId: this.props.navigation.state.params.id,
      isUpdatingScore: false,
      log: this.props.navigation.state.params.log,
      isEliminated: this.props.navigation.state.params.isEliminated,
      showOptions: false
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
    this.props.navigation.setParams({ 
      leftButton: this._renderLeftHeaderButton(),
      rightButton: this._renderRightHeaderButton()
    });

    this.refs.scoreInput.focus();
    this.props.screenProps.store.set("currentScreen", "Game")
  }
  
  render() {
    const store = this.props.screenProps.store
    const data = store.get("players")[this.state.playerId];
    const scoreToDisplay = this.state.isUpdatingScore ? this.state.scoreToDisplay : data.score;
    const statusStyle = this.state.isEliminated ? {opacity: 0} : {opacity: 1}
    const statusColor = this.state.isEliminated ? Colors.GREEN : 'red'
    const eliminateButtonLabel = this.state.isEliminated ? 'Réintégrer ce joueur' : 'Éliminer ce joueur'
    const optionsStyles = this.state.showOptions ? {display: 'flex'} : {display: 'none'}
    const showOptionsLabel = this.state.showOptions ? "Cacher les options" : "Montrer les options" 

    return (
      <ScrollView style={{
        backgroundColor: Colors.GREEN,
        flex: 1
      }}>
        { this._renderHeader() }
        <View
          style={styles.card}
        >
          <View style={
            styles.nameContainer
          }>
            <Text style={Base.HEADING_2}>
              {data.icon.item}
              {data.name}
            </Text>
            <Text style={Base.HEADING_2}>
              {scoreToDisplay}
            </Text>
          </View>
          <TextInput 
            style={[
              styles.input,
              statusStyle
            ]}
            ref='scoreInput'
            placeholder='0'
            onChangeText={(_amount) => this.setState({'amount' : _amount, 'amountToDisplay' : _amount})}
            value={this.state.amountToDisplay}
            keyboardType='numeric'
            clearTextOnFocus={true}
            textAlign={'center'}
            underlineColorAndroid='transparent'
          />
          <View style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-around'
              }, 
              statusStyle
            ]
          }>
            <PPButton 
              title='Retirer'
              onPress={this._onPressRemove}
            />
            <PPButton 
              title='Ajouter'
              onPress={this._onPressAdd}
            />
          </View>
        </View>
        <PPButton
          title={showOptionsLabel}
          onPress = {() => {
            this.setState({
              showOptions: !this.state.showOptions
            })
          }}
          color={'white'}
        />
        <View style={optionsStyles}>
          <PPHoveringButton
            style= {{ 
              backgroundColor: 'white',
              marginBottom: 0
            }}
            color={ Colors.BLUE }
            title={ "Terminer un tour" }
            onPress= {this._onScorePress}
          />
          <PPHoveringButton
            style= {{ 
              backgroundColor: 'white',
              marginBottom: 0
            }}
            color={ statusColor }
            title={ eliminateButtonLabel }
            onPress= {() => {
              store.updatePlayer(this.state.playerId, "isEliminated", !this.state.isEliminated)
              this.setState({
                isEliminated: !this.state.isEliminated
              })
            }}
          />
          <FlatList
            style={styles.logList}
            data={data.log}
            ListHeaderComponent = { this._renderLogListHeader }
            renderItem = {({item}) => this._renderLogItem(item)}
          />
        </View>
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
    this.props.navigation.replace("PlayerScore", this.nextPlayer)
  }

  _onPressAdd = () => {
    if(this.state.isUpdatingScore) return;
    
    const points = parseInt(this.refs.scoreInput.props.value);
    this._changeScore(points);
  }

  _onPressRemove = () => {
    if(this.state.isUpdatingScore) return;
    
    const points = -parseInt(this.refs.scoreInput.props.value);
    this._changeScore(points);
  }

  _onLogItemPress = (_data) => {
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
          const index = this.state.log.findIndex(x => x.timestamp==_data.timestamp);
          this._removeLogEntry(index);
        }
      });
  }

  _onScorePress = () => {
    this.props.navigation.navigate('PlayerDistributePoints', this.props.navigation.state.params)
  }

  _changeScore = (_points, _doLog = true) => {
    this.setState({
      isUpdatingScore: true,
      counterStep: 0
    })
    this.tickInterval = setInterval(() => {this._updateScoreDisplay(_points, _doLog)}, this.delay / this.nbSteps)
  }

  _updateScoreDisplay = (_points, _doLog) => {
    const step = this.state.counterStep++;
    const newScore = this._getTotalFromLog() + parseInt(_points / this.nbSteps * step);

    let newAmount;
    if(_points > 0){
      newAmount = this.state.amount - parseInt(_points / this.nbSteps * step);
    }
    else{
      newAmount = parseInt(this.state.amount) + parseInt(_points / this.nbSteps * step);
    }
    
    this.setState({
      scoreToDisplay: newScore,
      amountToDisplay: newAmount.toString()
    })
    
    if(parseInt(step) === parseInt(this.nbSteps)){
      clearInterval(this.tickInterval);
      this._saveScore(_points, newScore, _doLog);
      //this._gotoNextPlayer();
    } 
  }

  _saveScore = (_points, _score, _doLog = true) => {
    const input = this.refs.scoreInput
    const players = this.props.screenProps.store.get("players");
    let newPlayers = [];

    for (let i = 0; i < players.length; i++) {
      const element = players[i];
      let newPlayer = JSON.parse(JSON.stringify(element));
      if(element.id === this.props.navigation.state.params.id){
        newPlayer.score = _score;
        if(_doLog){
          newPlayer.log.unshift({
            timestamp: Date.now(),
            points: _points
          })
        }
      } 
      newPlayers.push(newPlayer);
    }
    
    this.props.screenProps.store.set("players", newPlayers)

    this.setState({
      score: _score, 
      amount: '0',
      isUpdatingScore: false
    })
    input.clear();
  }

  _removeLogEntry = (_index) => {
    const pointsToRemove = this.state.log[_index].points * -1;
    this.state.log.splice(_index, 1)

    const store = this.props.screenProps.store;
    const players = store.get("players");
    let newPlayers = players.slice(); //copy
    const player = newPlayers[this.state.playerId];
    player.log = this.state.log;
    player.score = player.score + pointsToRemove;
    store.set("players", newPlayers)
    
    this.setState({
      score: player.score,
      scoreToDisplay: player.score,
      log: player.log
    })
  }

  _getTotalFromLog = () => {
    let total = 0;
    for (let i = 0; i < this.state.log.length; i++) {
      total += this.state.log[i].points
    }
    return total;
  }
}

const styles = EStyleSheet.create({
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '1.5rem',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 0.2,
    shadowOffset: {height: 3, width: 0},
    shadowRadius: 10,
  },
  card: {
    backgroundColor: 'white',
    margin: '1.5rem',
    borderRadius: '1rem',
    padding: '1.5rem',
    shadowColor: 'rgb(0,0,0)',
    shadowOpacity: 0.2,
    shadowOffset: {height: 7, width: 0},
    shadowRadius: 7,
  },
  input: {
    fontSize: '5rem',
    fontWeight: 'bold',
    marginVertical: '3rem'
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '3rem'
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
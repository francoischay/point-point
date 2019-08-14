import React from 'react';
import {View,TouchableOpacity, Text, Switch} from 'react-native';
import PPButton from '../components/PPButton';
import PPHoveringButton from '../components/PPHoveringButton';
import Player from '../components/Player';
import SortableList from '../node_modules/react-native-sortable-list/src/SortableList';
import { Colors, Base } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class PlayersScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Joueurs',
      header: null
    }
  };

  constructor(props) {
    super(props);
    
    this.state = {
      rankByLessPoints: this.props.screenProps.store.get("gameSettings").rankByLessPoints.value,
      goBackToList: this.props.screenProps.store.get("gameSettings").goBackToList.value,
      autoSwitchToNextPlayer: this.props.screenProps.store.get("gameSettings").autoSwitchToNextPlayer.value,
      selectedPlayersIds: {}
    }
  }

  render() {

    return (
      <View style = {{ flex: 1,
        backgroundColor: Colors.BACKGROUND, 
      }}>
        { this._renderList() }
        { this._renderFooter() }
      </View>
    );
  }

  _getRightHeaderButton = () => {
      return (
      <TouchableOpacity 
          onPress={ this._onAddButtonPress } 
          style={ styles.headerButtonContainer }
      >
          <Text
              style={ styles.headerButtonText }
          >
            Ajouter un joueur
          </Text>
      </TouchableOpacity>)
  }

  _renderList = () => {
    const players = this.props.screenProps.store.get("players");
    const order = this.props.screenProps.store.get("order");

    return <SortableList
      ref="SortableList"
      style = {styles.playersList}
      contentContainerStyle ={styles.contentContainer}
      data = { players }
      order = { order }
      manuallyActivateRows = { true }
      renderHeader = { this._renderPlayersHeader }
      renderRow = { this._renderRow }
      onChangeOrder = { this._onChangeOrder }
      onReleaseRow = { this._onReleaseRow }
      //onPressRow = { this._onPressRow }
    />
  }

  _renderRow = (_data) => {
    return <Player 
      data={ _data.data } 
      active={_data.active} 
      onNamePress= { this._onNamePress }
      onCheckboxPress= { this._onCheckboxPress }
      onHandlePress= { this._onHandlePress }
    />
  }

  _renderPlayersHeader = () => {
    return (<View
      style={styles.headerContainer}
    >
      <Text
        style={ Base.HEADING_2 }
      >
        Joueurs
      </Text>
      { this._getRightHeaderButton() }
    </View>)
  }

  _renderFooter = () => {
    const players = this.props.screenProps.store.get("players");
    if(players.length < 2) return

    const label = (this._isGameOn()) ? "Reprendre la partie" : "C'est parti !"
    return (<View style={{
      bottom: 18,
      position: 'absolute',
      width: '100%'
    }}>
      <PPHoveringButton
        title={label}
        onPress={this._startGame}
      />
    </View>)
  }

  _isGameOn = () => {
    const players = this.props.screenProps.store.get("players");
    for (let i = 0; i < players.length; i++) {
      const element = players[i];
      if(element.log.length > 0) return true;
    }

    return false;
  }

  _onReleaseRow = () => {
    this._updateOrderFromList();
  }

  _onCheckboxPress = (_playerId) => {
    const players = this.props.screenProps.store.get("players");
    this.props.screenProps.store.updatePlayer(_playerId, 'isSelected', !players[_playerId].isSelected);
  }

  _onNamePress= (_playerId) => {
    const players = this.props.screenProps.store.get("players");
    this.props.navigation.navigate("EditPlayer", players[_playerId]);
  }

  _onHandlePress = (_playerId) => {
    this.refs.SortableList._rows[_playerId]._toggleActive()
  }

  _onChangeOrder = (_order) => {
    this.props.screenProps.store.set("order", this.refs.SortableList.state.order)
  }

  _updateOrderFromList = () => {
    if(!this.refs.SortableList) return;
    this.props.screenProps.store.set("order", this.refs.SortableList.state.order)
  }

  _startGame = () => {
    this.props.navigation.navigate("Game")
  }
  
  _onAddButtonPress = (_event) => {
    this.props.navigation.navigate("AddPlayer")
  }
}

const styles = EStyleSheet.create({
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '3rem',
    paddingBottom: '1.5rem'
  },
  playersList: {
    flex: 1,
    marginBottom: '3rem'
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: '1.5rem',
    marginTop: '1rem',
    paddingBottom: '10rem',
  },
  headerButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerButtonText: {
      color: '#007AFF',
      fontSize: '1.25rem',
      marginRight: '1.5rem'
  },
  icon: {
      height: 21,
      width: 12,
      marginLeft: 9,
      marginRight: '1.5rem',
      marginVertical: 12,
      resizeMode: 'contain',
      transform: [{ scaleX: -1 }]
  }
});
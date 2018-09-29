import React from 'react';
import {View,TouchableOpacity, Text, Image} from 'react-native';
import PPButton from '../components/PPButton';
import PPHoveringButton from '../components/PPHoveringButton';
import Player from '../components/Player';
import SortableList from '../node_modules/react-native-sortable-list/src/SortableList';
import { Colors } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';

const defaultBackImage = require('../assets/images/back-icon.png');

export default class PlayersScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerRight: navigation.getParam('rightButton')
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ 
      rightButton: this._getRightHeaderButton()
    });
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
      renderRow = { this._renderRow }
      onChangeOrder = { this._onChangeOrder }
      onReleaseRow = { this._onReleaseRow }
      onPressRow = { this._onPressRow }
    />
  }

  _renderRow = (_data) => {
    return <Player data={ _data.data } active={_data.active} />
  }

  _renderFooter = () => {
    return (<View style={{marginTop: 24}}>
      <PPHoveringButton
        title="C'est parti !"
        onPress={this._startGame}
      />
    </View>)
  }

  _onReleaseRow = () => {
    this._updateOrderFromList();
  }

  _onPressRow = (_playerId) => {
    const players = this.props.screenProps.store.get("players");
    this.props.navigation.navigate("EditPlayer", players[_playerId]);
  }

  _onChangeOrder = (_order) => {
    this.props.screenProps.store.set("order", this.refs.SortableList.state.order)
  }

  _updateOrderFromList = () => {
    if(!this.refs.SortableList) return;
    this.props.screenProps.store.set("order", this.refs.SortableList.state.order)
  }

  _startGame = () => {
    console.log("start !")
    this.props.navigation.replace("Game")
  }

  _onScoreRowPress = (_data) => {
    this.props.navigation.navigate("PlayerScore", _data)
  }

  _onAddButtonPress = (_event) => {
    this.props.navigation.navigate("AddPlayer")
  }
}

const styles = EStyleSheet.create({
  playersList: {
    flex: 1
  },
  contentContainer: {
    width: '100%',
    padding: '1.5rem'
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
import React from 'react';
import {View} from 'react-native';
import PPButton from '../components/PPButton';
import Player from '../components/Player';
import SortableList from '../node_modules/react-native-sortable-list/src/SortableList';
import { Colors } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class PlayersScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state

    return {
      title: "Joueurs",
      headerRight: (
        <PPButton
          onPress={() => { params.startGame() }}
          title="Jouer !"
        />
      )
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ 
      startGame: this._startGame.bind(this)
    });
  }

  render() {
    return (
      <View style = {{ flex: 1,
        backgroundColor: Colors.BACKGROUND, 
      }}>
        { this._renderList() }
      </View>
    );
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
      renderFooter = { this._renderFooter }
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
      <PPButton
        title="Ajouter un joueur"
        onPress={this._onAddButtonPress}
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
    padding: '2rem'
  }
});
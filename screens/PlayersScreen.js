import React from 'react';
import {
  AsyncStorage,
  Button,
  FlatList,
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';
import Player from '../components/Player';
import SortableList from '../node_modules/react-native-sortable-list/src/SortableList';
import ScorePlayer from '../components/ScorePlayer';

export default class PlayersScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state

    return {
      title: "Joueurs",
      headerRight: (
        <Button
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
      <View style = {{ flex: 1 }}>
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
      <Button
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',

    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
  },

  title: {
    fontSize: 20,
    paddingVertical: 20,
    color: '#999999',
  },

  playersList: {
    flex: 1
  },

  gameList: {
    backgroundColor: 'black',
    flex: 1
  },

  contentContainer: {
    width: window.width,
    paddingTop: 30,

    ...Platform.select({
      ios: {
        paddingHorizontal: 30,
      },

      android: {
        paddingHorizontal: 0,
      }
    })
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    height: 80,
    flex: 1,
    borderRadius: 4,

    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },

      android: {
        width: window.width - 30 * 2,
        elevation: 0,
        marginHorizontal: 30,
      },
    })
  },

  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },

  text: {
    fontSize: 24,
    color: '#222222',
  },
});
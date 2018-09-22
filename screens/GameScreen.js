import React from 'react';
import {
  FlatList,
  View
} from 'react-native';
import PlayerWithScore from '../components/PlayerWithScore';
import PPButton from '../components/PPButton';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class PlayersScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state

    return {
      title: "Score",
      headerRight: (
        <PPButton
          onPress={() => { params.stopGame() }}
          title={ "Terminer !" }
        />
      )
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({
      stopGame: this._stopGame.bind(this)
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
    const gamePlayers = []

    for (let i = 0; i < order.length; i++) {
        for (let j = 0; j < players.length; j++) {
            const player = players[j];
            if(player.id == order[i]) gamePlayers.push(player)
        }
    }

    return <FlatList
      style = {styles.gameList}
      contentContainerStyle ={styles.contentContainer}
      data = { gamePlayers }
      renderItem = {({item}) => this._renderItem(item)}
    />
  }

  _renderItem = (_data) => {
    return <PlayerWithScore 
      data={ _data } 
      onPress={ () =>  { this._onScoreRowPress(_data) }}
    />
  }

  _stopGame = () => {
    console.log("stop !")
    this.props.navigation.replace("Results")
  }

  _onScoreRowPress = (_data) => {
    this.props.navigation.navigate("PlayerScore", _data)
  }
}

const styles = EStyleSheet.create({
  gameList: {
    backgroundColor: '#0E7D6E',
    flex: 1
  },

  contentContainer: {
    padding: '2rem'
  }
});
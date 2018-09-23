import React from 'react';
import {
  FlatList,
  View
} from 'react-native';
import { Header } from 'react-navigation'
import PlayerWithScore from '../components/PlayerWithScore';
import PPHoveringButton from '../components/PPHoveringButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import ScoresModal from './ScoreModal';

export default class PlayersScreen extends React.Component {
  static navigationOptions = ({navigation}) => {

    return {
      title: "Score",
      header: null
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({
      stopGame: this._stopGame.bind(this)
    });
  }

  render() {
    return (
      <View style = {{ 
        backgroundColor: '#0E7D6E',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        { this._renderList() }
        { this._renderFooter() }
        <ScoresModal 
          ref='ScoresModal'
          store={ this.props.screenProps.store }
          onPress = { this._stopGame }
        />
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

  _renderFooter = () => {
    return <PPHoveringButton
      onPress={ this._showScores }
      title={ "Faire un point points" }
    />
  }

  _showScores = () => {
    this.refs.ScoresModal.show();
  }

  _stopGame = () => {
    console.log("stop !")
    this.props.navigation.replace("Players")
  }

  _onScoreRowPress = (_data) => {
    this.props.navigation.navigate("PlayerScore", _data)
  }
}

const styles = EStyleSheet.create({
  gameList: {
    flex: 1
  },

  contentContainer: {
    padding: '2rem',
    paddingTop: Header.HEIGHT
  }
});
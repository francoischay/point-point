import React from 'react';
import {
  FlatList,
  View
} from 'react-native';
import PlayerWithScore from '../components/PlayerWithScore';
import PPHoveringButton from '../components/PPHoveringButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import ScoresModal from './ScoreModal';
import { Colors } from '../styles/Base';

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
      <View style = { styles.pageContainer }>
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
      style={{backgroundColor: 'white'}}
      color={Colors.GREEN}
    />
  }

  _showScores = () => {
    this.refs.ScoresModal.show();
  }

  _stopGame = () => {
    console.log("stop !")

    const players = this.props.screenProps.store.get("players");
    for (let i = 0; i < players.length; i++) {
      players[i].score = 0;
      players[i].log = []
    }
    this.props.screenProps.store.set("players", players);

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
  pageContainer: { 
    backgroundColor: Colors.GREEN,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentContainer: {
    padding: '1.5rem',
    '@media ios': {
      paddingTop: '64 + 1.5rem',
    },
    '@media android': {
      paddingTop: '56 + 1.5rem',
    }
  }
});
import React from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PlayerWithScore from '../components/PlayerWithScore';
import PPHoveringButton from '../components/PPHoveringButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import ScoresModal from './ScoreModal';
import { Base, Colors } from '../styles/Base';

export default class PlayersScreen extends React.Component {
  static navigationOptions = () => {
    return {
      title: "Scores",
      header: null
    };
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
      ListHeaderComponent = { this._renderHeader }
    />
  }

  _renderItem = (_data) => {
    return <PlayerWithScore 
      data={ _data } 
      onPress={ () =>  { this._onScoreRowPress(_data) }}
    />
  }

  _renderHeader = () => {
    return (<View
      style={styles.headerContainer}
    >
      <Text
        style={ [Base.HEADING_2, {
          color: 'white'
        }]}
      >
         Scores
      </Text>
    </View>)
  }

  _renderFooter = () => {
    return (<View style={{
      bottom: 18,
      position: 'absolute',
      width: '100%',
      zIndex: 0
    }}>
      <PPHoveringButton
        onPress={ this._showScores }
        title={ "Faire un point POINTS" }
        style={{backgroundColor: 'white'}}
        color={Colors.BLUE}
      />
    </View>)
  }

  _showScores = () => {
    this.refs.ScoresModal.show();
  }

  _stopGame = () => {
    console.log("stop !")

    const players = this.props.screenProps.store.get("players");
    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      player.score = 0;
      player.log = [];
      player.isEliminated = false;
    }
    this.props.screenProps.store.set("players", players);

    this.props.navigation.replace("Players")
  }

  _onScoreRowPress = (_data) => {
    this.props.navigation.navigate("PlayerScore", _data)
  }
}

const styles = EStyleSheet.create({
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '3rem',
    paddingBottom: '1.5rem',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 0.2,
    shadowOffset: {height: 3, width: 0},
    shadowRadius: 10,
  },
  headerButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerButtonText: {
      color: 'white',
      fontSize: '1.25rem',
      marginRight: '1.5rem'
  },
  gameList: {
    flex: 1
  },
  pageContainer: { 
    backgroundColor: Colors.GREEN,
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: '1.5rem',
    paddingBottom: '10rem',
    marginTop: '1rem',
  }
});
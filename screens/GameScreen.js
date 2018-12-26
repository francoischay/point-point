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
        { this._renderHeader() }
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

    return <View style={{
      flex: 1,
      zIndex: 0
    }}>
      <FlatList
        style = {[styles.gameList, Base.SHADOW]}
        contentContainerStyle ={styles.contentContainer}
        data = { gamePlayers }
        renderItem = {({item}) => this._renderItem(item)}
      />
    </View>
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

    this.props.navigation.popToTop()
  }

  _onScoreRowPress = (_data) => {
    this.props.navigation.navigate("PlayerScore", _data)
  }
}

const styles = EStyleSheet.create({
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '4rem',
    paddingBottom: '0.5rem',
    paddingHorizontal: '1.5rem'
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
    marginHorizontal: '1.5rem',
    marginBottom: '10rem',
    marginTop: '1rem',
    borderRadius: 12,
    overflow: 'hidden'
  }
});
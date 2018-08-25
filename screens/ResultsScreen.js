import React from 'react';
import {
  Button,
  FlatList,
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';
import ScorePlayer from '../components/ScorePlayer';

export default class ResultsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state

    return {
      title: "Résultats"
    }
  };

  render() {
    return (
      <View style = {{ flex: 1 }}>
        { this._renderList() }
        <Button
            title="Nouvelle partie"
            onPress={()=>{this.props.navigation.replace("Players")}}
        />
      </View>
    );
  }

  _renderList = () => {
    const players = this.props.screenProps.store.get("players");
    const results = players.sort((_player1, _player2) => {
        if (_player1.score > _player2.score) return -1;
        if (_player1.score < _player2.score) return 1;
    })

    return <FlatList
        style = {styles.gameList}
        contentContainerStyle ={styles.contentContainer}
        data = { results }
        renderItem = {({item}) => this._renderItem(item)}
    />
  }

  _renderItem = (_data) => {
    return <ScorePlayer 
      data={ _data } 
    />
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
    backgroundColor: 'blue',
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
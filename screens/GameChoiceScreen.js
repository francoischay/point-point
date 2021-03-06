import React from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PPHoveringButton from '../components/PPHoveringButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Base, Colors } from '../styles/Base';
import PPCheckbox from '../components/PPCheckbox';

export default class GameChoiceScreen extends React.Component {
  static navigationOptions = () => {
    return {
      title: "Jeu",
      header: null
    };
  };

  constructor(props){
    super(props)

    this.state = {
      games : [
        { 
          id: 0,
          title: 'Rummikub',
          settings : {
            rankByLessPoints:{
              value: false
            },
            autoSwitchToNextPlayer: {
              value: false
            },
            goBackToList: {
              value: true
            },
            doSubstract: {
              value: true
            },
            onlyDistributePointsAtEndOfTour: {
              value: true
            },
            extraPointsForWinner: {
              value: 0
            }
          } 
        },
        { 
          id: 1,
          title: 'Triomino',
          settings : {
            rankByLessPoints:{
              value: false
            },
            autoSwitchToNextPlayer: {
              value: true
            },
            goBackToList: {
              value: false
            },
            doSubstract: {
              value: false
            },
            onlyDistributePointsAtEndOfTour: {
              value: false
            },
            extraPointsForWinner: {
              value: 25
            }
          }
        },
        { 
          id: 2,
          title: 'Domino',
          settings : {
            rankByLessPoints:{
              value: true
            },
            autoSwitchToNextPlayer: {
              value: false
            },
            goBackToList: {
              value: true
            },
            doSubstract: {
              value: false
            },
            onlyDistributePointsAtEndOfTour: {
              value: false
            },
            extraPointsForWinner: {
              value: 0
            }
          }
        },
        { 
          id: 3,
          title: 'Mölky',
          settings : {
            rankByLessPoints:{
              value: false
            },
            autoSwitchToNextPlayer: {
              value: true
            },
            goBackToList: {
              value: false
            },
            doSubstract: {
              value: false
            },
            onlyDistributePointsAtEndOfTour: {
              value: false
            },
            extraPointsForWinner: {
              value: 0
            }
          }
        },
        { 
          id: 4,
          title: 'Paramétrer',
          settings : {
            rankByLessPoints:{
              title: 'Le gagnant est celui avec le moins de point',
              value: false
            },
            autoSwitchToNextPlayer: {
              title: 'Après avoir ajouter des points, passer automatiquement au joueur suivant',
              value: false
            },
            goBackToList: {
              title: 'Après avoir ajouter des points, retourner à la liste des joueurs',
              value: false
            },
            onlyDistributePointsAtEndOfTour: {
              title: 'Le joueur gagnant un tour récupère les points des autres',
              value: false
            },
            doSubstract: {
              title: 'Quand le gagnant du tour récupère les points des perdants, les retirer également aux perdants',
              value: false
            },
            extraPointsForWinner: {
              title: 'Le joueur gagnant un tour a automatiquement un nombre de points attribués ',
              value: 0
            }
          }
        }
      ],
      selectedGameId : 0
    }

    this.props.screenProps.store.set('gameSettings', this.state.games[this.state.selectedGameId].settings)
  }

  render() {
    return (
      <View style = { styles.pageContainer }>
        { this._renderHeader() }
        { this._renderList() }
        { this._renderFooter() }
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
        data = { this.state.games }
        renderItem = {({item}) => this._renderItem(item)}
      />
    </View>
  }

  _renderItem = (_data) => {
    const isSelected = (_data.id === this.state.selectedGameId) ? true : false;
    
    return <TouchableOpacity 
      onPress={ () =>  { this._onGameTypePress(_data) }}
      style={Base.ROW}
    >
      {isSelected ? (
          <View style={{ flexDirection: 'row'}}>
            <PPCheckbox selected={true} />
            <Text style={[Base.TEXT, {color: Colors.GREEN}]}>{ _data.title }</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row'}}>
            <PPCheckbox selected={false} />
            <Text style={Base.TEXT}>{ _data.title }</Text>
          </View>
        )
      }
    </TouchableOpacity>
  }

  _renderHeader = () => {
    return (<View
      style={styles.headerContainer}
    >
      <Text
        style={ [Base.HEADING_2]}
      >
        Choix du jeu
      </Text>
    </View>)
  }

  _renderFooter = () => {
    const screen = this.state.selectedGameId === 4 ? "CustomSettings" : "Players";
    
    return (<View style={{
      bottom: 18,
      position: 'absolute',
      width: '100%',
      zIndex: 0
    }}>
      <PPHoveringButton
        onPress={ () => this.props.navigation.navigate(screen) }
        title={ "Choisir les joueurs" } 
      />
    </View>)
  }

  _onGameTypePress = (_data) => {
    this.setState({
      selectedGameId: _data.id
    })
    this.props.screenProps.store.set('gameSettings', this.state.games[_data.id].settings)
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
    backgroundColor: Colors.BACKGROUND,
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
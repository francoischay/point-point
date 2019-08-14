import React from 'react';
import {
  Dimensions,
  Text,
  View,
  FlatList,
  Switch,
  ScrollView
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Base, Colors } from '../styles/Base';
import HeaderWithButton from '../components/HeaderWithButton';
import PPTextInput from '../components/PPTextInput';
import PPButton from '../components/PPButton';


export default class PlayerDistributePointsScreen extends React.Component {
    static navigationOptions = () => {
        return {
            header: null
        };
    };

    constructor(props) {
        super(props);

        const store = this.props.screenProps.store;

        this.state = {
          totalToAdd: 0,
          playerId: this.props.navigation.state.params.id,
          pointsForTheWinner: store.get('gameSettings').extraPointsForWinner.value,
          score: this.props.navigation.state.params.score,
          points: [],
          doSubstract: false
        }
    }

    render() {
      return (
        <View style={styles.pageContainer}>
          { this._renderHeader() }
          <ScrollView
            style={[styles.card, Base.SHADOW]}
          >
            { this._renderListHeader() }
            <Text>
              Rentrer les points qui restent aux différents joueurs.
            </Text>
            { this._renderList() }
          </ScrollView>
        </View>   
      )
    }

    componentDidMount = () =>{
      const store = this.props.screenProps.store;
      const data = this.props.navigation.state.params;
      const players = store.get("players");
      const order = store.get("order");
      const gamePlayers = [];
  
      for (let i = 0; i < order.length; i++) {
        for (let j = 0; j < players.length; j++) {
          const player = players[j];
          if(player.id == order[i] && player.id != data.id && player.isSelected) gamePlayers.push(player)
        }
      }

      const points = gamePlayers.map((_player) => { return {
        id: _player.id,
        icon: _player.icon.item,
        name: _player.name,
        points: 0
      }})

      this.setState({
        points: points,
        doSubstract: store.get('gameSettings').doSubstract.value
      })
    }

    _renderHeader = () => {
      const data = this.props.navigation.state.params;

      return (
        <HeaderWithButton 
          title={ data.icon.item +" "+ data.name }
          actionLabel='Sauver'
          goBackLabel='Retour'
          navigation={this.props.navigation}
          action= { this._onSavePress }
        />
      )
    }

    _renderListHeader = () => {
      const data = this.props.navigation.state.params;
      
      return (<View
          style={styles.headerContainer}
        >
          <Text style={Base.HEADING_2}>
            { data.icon.item } { data.name }
          </Text>
          <Text style={Base.HEADING_2}>
            { this.state.pointsForTheWinner }
          </Text>
        </View>
      )
    }

    _renderSwitch = () => {
      return (
        <View style={[ {
          flexDirection: 'row',
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: 1.5 * EStyleSheet.value('$rem')
        }]}>
          <Text style={Base.TEXT}>Retirer les points aux autres</Text>
          <Switch 
            value={this.state.doSubstract}
            onValueChange={ this._onSwitchChange }
          />
        </View>
      )
    }

    _renderList = () => {
      return (
        <FlatList
          style = { styles.list }
          data = { this.state.points }
          renderItem = {({item, index}) => this._renderItem(item, index)}
        />
      )
    }
    
    _renderItem = (_data, _index) => {
      const minusOpacity = this.state.doSubstract && _data.id > -1 ? {opacity: 1} : {opacity:0}
      const item = <View style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'stretch',
            paddingVertical: EStyleSheet.value('$rem') * 0.75
          }]}
        >
          <Text style={[Base.TEXT, {paddingTop: EStyleSheet.value('$rem') * 0.75}]}>
            {_data.icon} {_data.name}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignContent: 'stretch'
          }}>
            <Text style={[Base.TEXT, minusOpacity, {
                paddingTop: EStyleSheet.value('$rem') * 0.75
              }
            ]}>
              -
            </Text>
            <PPTextInput
              placeholder='0'
              value={_data.points.toString()}
              style={[Base.TEXT_INPUT, {
                textAlign: 'right'
              }]}
              onChangeText={ (_value) => this._onChange(_value, _data, _index) }
              keyboardType='numeric'
            />
          </View>
        </View>

      return item;
    }

    _onChange = (_value, _data, _index) => {
      const store = this.props.screenProps.store;
      const points = this.state.points
      points[_index].points = parseInt(_value);

      let pointsForTheWinner = store.get('gameSettings').extraPointsForWinner.value;
      this.state.points.forEach((item) => {
        pointsForTheWinner += item.points
      })

      this.setState({
        points: points,
        pointsForTheWinner: pointsForTheWinner
      })
    }

    _onSwitchChange = (_value) => {
      this.setState({
        doSubstract: _value
      })
    }

    _onSavePress = () => {
      const store = this.props.screenProps.store;
      const players = store.get("players");
      let newLog = players[this.state.playerId].log.slice();
      newLog.unshift({
        timestamp: Date.now(),
        points: this.state.pointsForTheWinner
      })
      
      store.updatePlayer(this.state.playerId, 'log', newLog)
      
      for (let i = 0; i < players.length; i++) {
        let newPlayer = JSON.parse(JSON.stringify(players[i]));
        
        if(newPlayer.id !== this.state.playerId && this.state.doSubstract){
          const playerPointsToChange = this._findPointsByPlayerId(newPlayer.id);
          newPlayer.score -= playerPointsToChange;

          let newLog = newPlayer.log.slice();
          newLog.unshift({
            timestamp: Date.now(),
            points: -this._findPointsByPlayerId(newPlayer.id)
          })
          store.updatePlayer(newPlayer.id, 'log', newLog)
        }
        //newPlayer.score = 0;
        //newPlayer.log = []
      }

      this.props.navigation.navigate('Game')
    }

    _findPointsByPlayerId = (_id) => {
      const player = this.state.points.find((_score) => {
        return _score.id === _id
      })
      
      return player.points;
    }
}

const styles = EStyleSheet.create({
  card: {
    backgroundColor: 'white',
    margin: '1.5rem',
    marginTop: 0,
    borderRadius: '1rem',
    padding: '1.5rem'
  },
  pageContainer: {
      backgroundColor: Colors.GREEN,
      flex: 1
  },
  list: {
    paddingBottom: Dimensions.get('window').height / 2
  },
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '1.5rem'
  }
})
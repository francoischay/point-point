import React from 'react';
import {
    Text,
    View
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Base, Colors } from '../styles/Base';
import { FlatList, TextInput, Switch, ScrollView } from 'react-native-gesture-handler';
import HeaderWithButton from '../components/HeaderWithButton';
import PPTextInput from '../components/PPTextInput';


export default class PlayerDistributePointsScreen extends React.Component {
    static navigationOptions = () => {
        return {
            header: null,
            headerStyle: {
                backgroundColor: 'white',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            }
        };
    };

    constructor(props) {
        super(props);

        this.state = {
          totalToAdd: 0,
          futureTotal: this.props.navigation.state.params.score,
          score: this.props.navigation.state.params.score,
          points: [],
          doSubstract: false
        }
    }

    render() {
      return (
        <View style={styles.pageContainer}>
          { this._renderHeader() }
          <ScrollView>
            { this._renderListHeader() }
            { this._renderSwitch() }
            { this._renderList() }
          </ScrollView>
        </View>   
      )
    }

    componentDidMount = () =>{
      const data = this.props.navigation.state.params;
      const players = this.props.screenProps.store.get("players");
      const order = this.props.screenProps.store.get("order");
      const gamePlayers = []
  
      for (let i = 0; i < order.length; i++) {
          for (let j = 0; j < players.length; j++) {
              const player = players[j];
              if(player.id == order[i] && player.id != data.id) gamePlayers.push(player)
          }
      }

      let points = []
      gamePlayers.forEach((item) => {
        points.push({
          id: item.id,
          icon: item.icon.item,
          name: item.name,
          points: 0
        })
      })
      this.setState({
        points: points
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
            { this.state.futureTotal }
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
          data = { this.state.points }
          renderItem = {({item, index}) => this._renderItem(item, index)}
        />
      )
    }
    
    _renderItem = (_data, _index) => {
      const minusOpacity = this.state.doSubstract ? {opacity: 1} : {opacity:0}
      const item = <View style={[Base.ROW, {
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
            />
          </View>
        </View>

      return item;
    }

    _onChange = (_value, _data, _index) => {
      const points = this.state.points
      points[_index].points = parseInt(_value);

      let futureTotal = this.state.score;
      this.state.points.forEach((item) => {
        futureTotal += item.points
      })

      this.setState({
        points: points,
        futureTotal: futureTotal
      })
    }

    _onSwitchChange = (_value) => {
      this.setState({
        doSubstract: _value
      })
    }

    _onSavePress = () => {
      const players = this.props.screenProps.store.get("players");
      let newPlayers = [];

      for (let i = 0; i < players.length; i++) {
        const element = players[i];
        let newPlayer = JSON.parse(JSON.stringify(element));
        if(element.id === this.props.navigation.state.params.id){
          newPlayer.score = this.state.futureTotal;
          newPlayer.log.unshift({
            timestamp: Date.now(),
            points: this.state.futureTotal - this.state.score
          })
        }
        else{
          if(this.state.doSubstract){
            const playerPointsToChange = this._findPointsByPlayerId(newPlayer.id);
            newPlayer.score -= playerPointsToChange;
  
            newPlayer.log.unshift({
              timestamp: Date.now(),
              points: -this._findPointsByPlayerId(newPlayer.id)
            })
          }
        }
        //newPlayer.score = 0;
        //newPlayer.log = []
        newPlayers.push(newPlayer);
      }
    
      console.log(newPlayers)

      this.props.screenProps.store.set("players", newPlayers)

      this.props.navigation.goBack();
    }

    _findPointsByPlayerId = (_id) => {
      const player = this.state.points.find((_score) => {
        return _score.id === _id
      })
      console.log(player.points)
      return player.points;
    }
}

const styles = EStyleSheet.create({
  pageContainer: {
      backgroundColor: 'white',
      flex: 1
  },
  headerContainer:{
    paddingHorizontal: '1.5rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '3rem',
    paddingBottom: '1.5rem',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 0.2,
    shadowOffset: {height: 3, width: 0},
    shadowRadius: 10,
  },
})
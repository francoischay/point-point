import React from 'react';
import {
    Text,
    View
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Base, Colors } from '../styles/Base';
import { FlatList, TextInput, Switch } from 'react-native-gesture-handler';


export default class PlayerDistributePointsScreen extends React.Component {
    static navigationOptions = () => {
        return {
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
        const data = this.props.navigation.state.params;
        const store = this.props.screenProps.store;

        return (
            <View style={styles.pageContainer}>
                { this._renderHeader() }
                { this._renderSwitch() }
                { this._renderList() }
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
      let futureTotal = data.score;
      this.state.points.forEach((item) => {
        futureTotal += item.points
      })
      
      return (<View
          style={styles.headerContainer}
        >
          <Text style={Base.HEADING_2}>
            { data.icon.item } { data.name }
          </Text>
          <Text style={Base.HEADING_2}>
            { futureTotal }
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
            justifyContent: 'right',
            alignContent: 'stretch'
          }}>
            <Text style={[Base.TEXT, minusOpacity, {paddingTop: EStyleSheet.value('$rem') * 0.75}]}>-</Text>
            <TextInput
              placeholder='0'
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
      this.setState({points: points})
    }

    _onSwitchChange = (_value) => {
      console.log(_value);
      this.setState({
        doSubstract: _value
      })
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
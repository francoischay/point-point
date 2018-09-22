import React from 'react';
import {
  Button,
  View
} from 'react-native';
import PPAvatarInput from '../components/PPAvatarInput';
import { TextInput } from '../node_modules/react-native-gesture-handler';
import { Base } from '../styles/Base';

export default class EditPlayer extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    
    let action = params.rightButtonAction ? params.rightButtonAction : () => {}
    
    return {
      headerRight: (
        <Button
          onPress={() => { action() }}
          title="Sauver"
        />
      ),
    }
  }

  constructor(props) {
    super(props);
    
    const data = this.props.navigation.state.params;
    
    this.state = {
        id: data.id,
        playerIcon: data.icon,
        playerName: data.name,
        score: data.score
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ 
      rightButtonAction: this._onSavePress
    });
  }

  render() {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#FFF',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}>
          <View style={{
            alignItems: 'center',
            width: '100%'
          }}>
            <PPAvatarInput 
              ref="IconInput"
              value={ this.state.playerIcon }
            />
            <TextInput
              style={Base.NAME_INPUT}
              placeholder='Nom'
              value={ this.state.playerName }
              onChangeText={ this._onPlayerNameChange }
            />
          </View>
          <Button
            title="Retirer ce joueur"
            onPress={ this._onRemovePlayerPress }
          />
      </View>
    );
  }

  _onPlayerNameChange = (_playerName) => {
    this.setState({
      playerName : _playerName
    })
  }

  _onSavePress = () => {
    if(this.state.playerName.length === 0) return;
    let store = this.props.screenProps.store;

    let newPlayers = JSON.parse(JSON.stringify(this.props.screenProps.store.get("players")));  
    newPlayers[this.state.id] = {
      id: this.state.id,
      icon: this.refs.IconInput.state.currentEmoji,
      name: this.state.playerName,
      score: 0,
      log: []
    };

    store.set('players', newPlayers);
    
    this.props.navigation.goBack();
  }

  _onRemovePlayerPress = () => {
    const store = this.props.screenProps.store;

    let newPlayers = JSON.parse(JSON.stringify(this.props.screenProps.store.get("players")));
    newPlayers.splice(this.state.id, 1);
    for (let i = 0; i < newPlayers.length; i++) {
      newPlayers[i].id = i
    }

    let newOrder = [];
    for (let i = 0; i < newPlayers.length; i++) {
      newOrder.push(newPlayers[i].id)
    }

    store.update(function() {
      return {
        order: newOrder,
        players: newPlayers
      };
    });

    this.props.navigation.goBack();
  }
}

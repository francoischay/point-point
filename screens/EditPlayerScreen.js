import React from 'react';
import {
  Button,
  View
} from 'react-native';
import PPAvatarInput from '../components/PPAvatarInput';
import { TextInput } from '../node_modules/react-native-gesture-handler';

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
    
    this.state = {
      playerIcon: '😀',
      playerName: 'toto'
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ 
      rightButtonAction: this._onAddPress
    });

    const data = this.props.navigation.state.params;
    this.setState({
        id: data.id,
        playerIcon: data.icon,
        playerName: data.name,
        score: data.score
    })
  }

  render() {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#FFF'
      }}>
          <View style={{
            alignItems: 'center',
            width: '100%'
          }}>
            <PPAvatarInput 
              value={ this.state.playerIcon }
              style={{
                height: 96,
                width: 96,
                fontSize: 60,
                marginBottom: 12
              }}
              onChangeText={ this._onPlayerIconChange }
              selectTextOnFocus
            />
          </View>
          <TextInput
            style={{
              marginBottom: 24,
              fontSize: 48
            }}
            placeholder='Nom'
            value={ this.state.playerName }
            onChangeText={ this._onPlayerNameChange }
          />
      </View>
    );
  }

  _onPlayerIconChange = (_playerIcon) => {
    this.setState({
      playerIcon : _playerIcon
    })
  }

  _onPlayerNameChange = (_playerName) => {
    this.setState({
      playerName : _playerName
    })
  }

  _onAddPress = () => {
    if(this.state.playerName.length === 0) return;

    let store = this.props.screenProps.store;

    let newPlayers = JSON.parse(JSON.stringify(this.props.screenProps.store.get("players")));  
    newPlayers[this.state.id] = {
      id: this.state.id,
      icon: this.state.playerIcon,
      name: this.state.playerName,
      score: 0,
      log: []
    };

    store.set('players', newPlayers);
    
    this.props.navigation.goBack();
  }
}

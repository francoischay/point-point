import React from 'react';
import {
  Button,
  FlatList,
  View
} from 'react-native';
import PPAvatarInput from '../components/PPAvatarInput';
import { TextInput } from '../node_modules/react-native-gesture-handler';
import PreviousName from '../components/PreviousName';

export default class AddPlayer extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    
    let action = params.rightButtonAction ? params.rightButtonAction : () => {}
    
    return {
      title: 'Nouveau joueur',
      headerRight: (
        <Button
          onPress={() => { action() }}
          title="Ajouter"
        />
      ),
    }
  }

  constructor(props) {
    super(props);
    
    this.state = {
      newPlayerIcon: '😀',
      newPlayerName: ''
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ 
      rightButtonAction: this._onAddPress
    });
  }

  render() {
    const previousNames = this.props.screenProps.store.get("previousNames");

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
              value={ this.state.newPlayerIcon }
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
              fontSize: 48,
              textAlign: 'center'
            }}
            placeholder='Nom'
            value={ this.state.newPlayerName }
            onChangeText={ this._onPlayerNameChange }
            ref="playerNameInput"
          />
          <FlatList
            data={ previousNames }
            renderItem={({item}) => {
              return <PreviousName
                onPress={this._onItemPressed.bind(this, item)}
                title={item}
                store={this.props.screenProps.store}
              />
            }}
            horizontal
          />
      </View>
    );
  }

  _onItemPressed(item) {
    this.setState({newPlayerName: item})
  }  

  _onPlayerIconChange = (_playerIcon) => {
    this.setState({
      newPlayerIcon : _playerIcon
    })
  }

  _onPlayerNameChange = (_playerName) => {
    this.setState({
      newPlayerName : _playerName
    })
  }

  _onAddPress = () => {
    if(this.state.newPlayerName.length === 0) return;

    let store = this.props.screenProps.store;

    let newPlayers = JSON.parse(JSON.stringify(this.props.screenProps.store.get("players")));  
    newPlayers[Object.keys(newPlayers).length] = {
      id: Object.keys(newPlayers).length,
      icon: this.state.newPlayerIcon,
      name: this.state.newPlayerName,
      score: 0,
      log: []
    };
    store.set('players', newPlayers);

    let newOrder = store.get("order");
    newOrder.push((newPlayers.length - 1)+"")
    store.set('order', newOrder)

    const existingNames= this.props.screenProps.store.get("previousNames")
    let playersToSave = Array.from(newPlayers, x => x.name);
    playersToSave = existingNames? playersToSave.concat(existingNames) : playersToSave;
    playersToSave = Array.from(new Set(playersToSave)); // remove duplicates
    playersToSave.sort();
    this.props.screenProps.store.set("previousNames", playersToSave)
    
    this.props.navigation.goBack();
  }

  _onCancelPress = () => {
    this.props.navigation.goBack()
  }
}

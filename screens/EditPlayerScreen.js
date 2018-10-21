import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';
import PPAvatarInput from '../components/PPAvatarInput';
import PPButton from '../components/PPButton';
import PPTextInput from '../components/PPTextInput';
import { Base, Colors } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';
import HeaderWithButton from '../components/HeaderWithButton';

const defaultBackImage = require('../assets/images/back-icon.png');

export default class EditPlayer extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null
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

  render() {
    return (
      <View style={ styles.pageContainer }>
          { this._renderHeader() }
          <View style={{
            width: '100%',
            flex:1,
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
          }}>
            <View>
              <PPAvatarInput 
                ref="IconInput"
                value={ this.state.playerIcon }
              />
            </View>
            <PPTextInput
              style={Base.NAME_INPUT}
              placeholder='Nom'
              value={ this.state.playerName }
              onChangeText={ this._onPlayerNameChange }
            />
          </View>
          <PPButton
            title="Retirer ce joueur"
            onPress={ this._onRemovePlayerPress }
          />
      </View>
    );
  }

  _renderHeader = () => {
    return (
      <HeaderWithButton 
        actionLabel='Sauver'
        goBackLabel='Joueurs'
        navigation={this.props.navigation}
        action= { this._onSavePress }
      />
    )
  }

  _goBack = () => {
      this.props.navigation.goBack()
  }

  _onPlayerNameChange = (_playerName) => {
    this.setState({
      playerName : _playerName
    })
  }

  _onSavePress = () => {
    if(this.state.playerName.length === 0) return;

    let store = this.props.screenProps.store;
    store.updatePlayer(this.state.id, 'icon', this.refs.IconInput.state.currentEmoji)
    store.updatePlayer(this.state.id, 'name', this.state.playerName)
    
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

const styles = EStyleSheet.create({
    pageContainer:{
      flex: 1, 
      justifyContent: 'space-between',
      backgroundColor: Colors.BACKGROUND,
      paddingBottom: '1.5rem'
    },
    headerButtonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerButtonText: {
        color: '#007AFF',
        fontSize: '1.25rem'
    },
    icon: {
        height: 21,
        width: 12,
        marginLeft: '1.5rem',
        marginRight: 6,
        marginVertical: 12,
        resizeMode: 'contain'
    },
    iconBack: {
        height: 21,
        width: 12,
        marginLeft: 6,
        marginRight: '1.5rem',
        marginVertical: 12,
        resizeMode: 'contain',
        transform: [{ scaleX: -1 }],
    },
})

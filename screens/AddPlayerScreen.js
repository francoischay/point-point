import React from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';
import PPButton from '../components/PPButton';
import PPHoveringButton from '../components/PPHoveringButton';
import PPAvatarInput from '../components/PPAvatarInput';
import PPTextInput from '../components/PPTextInput';
import PreviousName from '../components/PreviousName';
import { Base, Colors } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';

const defaultBackImage = require('../assets/images/back-icon.png');

export default class AddPlayer extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null
    }
  }

  constructor(props) {
    super(props);
    
    this.state = {
      newPlayerIcon: null,
      newPlayerName: ''
    }
  }

  render() {
    const previousNames = this.props.screenProps.store.get("previousNames");

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
                value={ this.state.newPlayerIcon }
              />
            </View>
            <PPTextInput
              style={Base.NAME_INPUT}
              placeholder='Nom'
              value={ this.state.newPlayerName }
              onChangeText={ this._onPlayerNameChange }
              ref="playerNameInput"
            />
          </View>
          <FlatList
            style={styles.previousNamesList}
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

  _renderHeader = () => {
    return (<View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      { this._renderLeftHeaderButton() }
      <PPHoveringButton
        onPress={ this._onAddPress }
        title="Ajouter"
      />
    </View>)
  }

  _renderLeftHeaderButton = () => {
      return (
          <TouchableOpacity 
              onPress={ this._goBack } 
              style={ styles.headerButtonContainer }
          >
              <Image
                  style={ styles.icon }
                  source={ defaultBackImage }
              />
              <Text
                  style={ styles.headerButtonText }
              >
                  Joueurs
              </Text>
          </TouchableOpacity>)
  }

  _goBack = () => {
      this.props.navigation.goBack()
  }

  _onItemPressed(item) {
    this.setState({newPlayerName: item})
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
      icon: this.refs.IconInput.state.currentEmoji,
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
    previousNamesList: {
    }
})

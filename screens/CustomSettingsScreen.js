import React from 'react';
import {
  FlatList,
  View,
  Text,
  Switch
} from 'react-native';
import PPHoveringButton from '../components/PPHoveringButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Base, Colors } from '../styles/Base';
import PPTextInput from '../components/PPTextInput';

export default class CustomSettingsScreen extends React.Component {
  static navigationOptions = () => {
    return {
      title: "Jeu",
      header: null
    };
  };

  constructor(props){
    super(props)

    const settings = this.props.screenProps.store.get('gameSettings');
    let settingsArray = [];
    for (const key in settings) {
      settingsArray.push({...{key: key}, ...settings[key]})
    }
    this.state = {
      gameSettings : settingsArray
    }

    this.props.screenProps.store.set('gameSettings', this.state.gameSettings)
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
    return <View style={{
      flex: 1,
      zIndex: 0
    }}>
      <FlatList
        style = {[styles.gameList, Base.SHADOW]}
        contentContainerStyle ={styles.contentContainer}
        data = { this.state.gameSettings }
        renderItem = {({item}) => this._renderItem(item)}
      />
    </View>
  }

  _renderItem = (_data) => {
    return <View 
      style={[Base.ROW, {flexDirection: 'row'}]}
    >
      <Text 
        style={[Base.TEXT, {flex: 3}]}
      >
        { _data.title }
      </Text>
      {typeof _data.value === 'boolean' ? (
        <Switch 
          style={[{marginLeft: 12}]} 
          value={_data.value} 
          onValueChange={ () => this._onSettingSwitchPress(_data) }
        />
      ) : (
        <PPTextInput 
          value={_data.value.toString()}
          style={[Base.TEXT_INPUT, {
            textAlign: 'right',
            width: 60,
            marginLeft: 12
          }]}
          keyboardType='numeric' 
        />
      )}
    </View>
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

  _onSettingSwitchPress = (_data) => {
    const store = this.props.screenProps.store;
    console.log(_data)
    let settings = this.state.gameSettings;
    let settingIndex = settings.findIndex(x => x.key === _data.key)

    console.log(settings)
    console.log(settingIndex)
    settings[settingIndex].value = !_data.value;

    console.log(settings)

    this.setState({
      gameSettings: settings
    })
    store.set('gameSettings', this.state.gameSettings)
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
    paddingBottom: '10rem',
    marginTop: '1rem',
    borderRadius: 12,
    overflow: 'hidden'
  }
});
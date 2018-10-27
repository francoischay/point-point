import React from 'react';
import {
  FlatList,
  View, 
  Text,
  TouchableOpacity 
} from 'react-native';
import PropTypes from 'prop-types'
import { Base, Colors } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';
import PPButton from '../components/PPButton';
import PPHoveringButton from '../components/PPHoveringButton';
import { connectActionSheet } from '@expo/react-native-action-sheet';

@connectActionSheet
export default class PlayerOptions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
      playerId: this.props.playerId
    }
  }

  render() {
    const log = this.props.store.getPlayerLog(this.state.playerId);
    const showOptionsLabel = this.state.showOptions ? "Cacher les options" : "Montrer les options" 
    const optionsStyles = this.state.showOptions ? {display: 'flex'} : {display: 'none'}
    
    return (
      <View>
        <PPButton
          title={showOptionsLabel}
          onPress = {() => {
            this.setState({
              showOptions: !this.state.showOptions
            })
          }}
          color={'white'}
        />
        <View style={optionsStyles}>
          <PPHoveringButton
            style= {{ 
              backgroundColor: 'white',
              marginBottom: 0
            }}
            color={ Colors.BLUE }
            title="Terminer un tour"
            onPress= {this.props.onEndOfTourPress}
          />
          <PPHoveringButton
            style= {[
              { 
                backgroundColor: 'white',
                marginBottom: 0
              }, 
              optionsStyles
            ]}
            color='red'
            title='Éliminer ce joueur'
            onPress= { () => {
              this.setState({showOptions: false})
              this.props.onEliminatePress(); 
            }}
          />
          <FlatList
            style={[styles.logList, Base.SHADOW]}
            data={log}
            ListHeaderComponent = { this._renderLogListHeader }
            renderItem = {({item}) => this._renderLogItem(item)}
          />
        </View>
      </View>
    )
  }

  _renderLogListHeader = () => {
    return (<View
        style={styles.headerContainer}
      >
        <Text
          style={ Base.HEADING_2 }
        >
          Historique
        </Text>
      </View>
    )
  }

  _renderLogItem = (_data) => {
    let time = new Date();
    time.setTime(_data.timestamp)
    
    const hours = ("0" + time.getHours()).slice(-2)
    const minutes = ("0" + time.getMinutes()).slice(-2)
    const seconds = ("0" + time.getSeconds()).slice(-2)
    const timeToDisplay = hours+":"+minutes+":"+seconds;

    return <TouchableOpacity 
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
      onPress={this._onLogItemPress.bind(this, _data)}
    >
      <Text style={styles.logListItem}>{ timeToDisplay }</Text> 
      <Text style={styles.logListItem}>{ _data.points }</Text> 
    </TouchableOpacity>
  }

  _onLogItemPress = (_data) => {
    const store = this.props.store;
    const log = store.getPlayerLog(this.state.playerId);
    let options = ['Supprimer cette entrée', 'Annuler', 'Annuler'];
    let destructiveButtonIndex = 0;
    let cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions({
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        title: 'Supprimer cette entrée ?',
        message: 'Le score sera recaculé'
      },
      buttonIndex => {
        if (buttonIndex === 0){
          const index = log.findIndex(x => x.timestamp==_data.timestamp);
          this._removeLogEntry(index);
        }
      });
  }

  _removeLogEntry = (_index) => {
    const store = this.props.store;
    const log = store.getPlayerLog(this.state.playerId);
    log.splice(_index, 1)
    
    let player = store.updatePlayer(this.state.playerId, 'log', log)
    
    this.setState({
      score: player.score,
      scoreToDisplay: player.score,
      log: player.log
    })
  }
}

PlayerOptions.propTypes = {
  store: PropTypes.object.isRequired,
  playerId: PropTypes.number.isRequired
}

const styles = EStyleSheet.create({
  logList: {
    backgroundColor: 'white',
    borderRadius: 6,
    margin: '1.5rem',
    padding: '1.5rem',
  },
  logListItem: {
    fontSize: '1rem',
    paddingVertical: '0.75rem'
  }
})
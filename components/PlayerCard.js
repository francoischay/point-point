import React from 'react';
import {
  View, 
  Text,
  TextInput} from 'react-native';
import PropTypes from 'prop-types'
import { Base } from '../styles/Base';
import PPButton from '../components/PPButton';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class PlayerCard extends React.Component {

  constructor(props) {
    super(props);

    this.delay = 650;
    this.nbSteps = 20;

    this.state = {
      score: 0,
      scoreToDisplay: this.props.data.score,
      amount: '',
      amountToDisplay: '',
      playerId: this.props.data.id,
      isUpdatingScore: false,
      log: this.props.data.log
    }
  }

  render() {
    const isEliminated = this.props.data.isEliminated;

    return (
      <View style={[styles.card, Base.SHADOW]}>
        { this._renderCardHeader() }
        { isEliminated ?  this._renderCardContentWhenEliminated() : this._renderCardContent() }
      </View>
    )
  }

  focusInput = () => {
    const isEliminated = this.props.data.isEliminated;
    if(!isEliminated) this.refs.scoreInput.focus();
  }

  _renderCardHeader = () => {
    const data = this.props.data;
    const scoreToDisplay = this.state.isUpdatingScore ? this.state.scoreToDisplay : data.score;
    
    return (
      <View style={
        styles.nameContainer
      }>
        <Text style={Base.HEADING_2}>
          {data.icon.item}
          {data.name}
        </Text>
        <Text style={Base.HEADING_2}>
          {scoreToDisplay}
        </Text>
      </View>
    )
  }

  _renderCardContent = () => {
    return (
      <View>
        <TextInput 
          style={ styles.input }
          ref='scoreInput'
          placeholder='0'
          onChangeText={(_amount) => this.setState({'amount' : _amount, 'amountToDisplay' : _amount})}
          value={this.state.amountToDisplay}
          keyboardType='numeric'
          clearTextOnFocus={true}
          textAlign={'center'}
          underlineColorAndroid='transparent'
        />
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
        }}>
          <PPButton 
            title='Retirer'
            onPress={this._onPressRemove}
          />
          <PPButton 
            title='Ajouter'
            onPress={this._onPressAdd}
          />
        </View>
      </View>
    )
  }

  _renderCardContentWhenEliminated = () => {
    return (
      <View>
        <PPButton
          title="Réintégrer ce joueur"
          onPress={ this._onReintegratePress }
        />
      </View>
    )
  }

  _onPressAdd = () => {
    const value = this.refs.scoreInput.props.value;
    if(this.state.isUpdatingScore || isNaN(value)) return;
    
    const points = parseInt(value);
    this._changeScore(points);
  }

  _onPressRemove = () => {
    const value = this.refs.scoreInput.props.value;
    if(this.state.isUpdatingScore || isNaN(value)) return;
    
    const points = -parseInt(value);
    this._changeScore(points);
  }

  _onReintegratePress = () => {
    const store = this.props.store;
    store.updatePlayer(this.state.playerId, "isEliminated", false)

    this.setState({
      showOptions: false
    })
  }

  _changeScore = (_points) => {
    this.setState({
      isUpdatingScore: true,
      counterStep: 0
    })
    this.tickInterval = setInterval(() => {this._updateScoreDisplay(_points)}, this.delay / this.nbSteps)
  }

  _updateScoreDisplay = (_points) => {
    const step = this.state.counterStep++;
    const newScore = this.props.data.score + parseInt(_points / this.nbSteps * step);

    let newAmount;
    if(_points > 0){
      newAmount = this.state.amount - parseInt(_points / this.nbSteps * step);
    }
    else{
      newAmount = parseInt(this.state.amount) + parseInt(_points / this.nbSteps * step);
    }
    
    this.setState({
      scoreToDisplay: newScore,
      amountToDisplay: newAmount.toString()
    })
    
    if(parseInt(step) === parseInt(this.nbSteps)){
      clearInterval(this.tickInterval);
      this._saveScore(_points, newScore);
      this.props.callbackAfterUpdatingScore();
    } 
  }

  _saveScore = (_points, _score) => {
    const input = this.refs.scoreInput
    const store = this.props.store;
    
    let newLog = store.getPlayerLog(this.state.playerId).slice();
    newLog.unshift({
      timestamp: Date.now(),
      points: _points
    })
    const player = store.updatePlayer(this.state.playerId, 'log', newLog)

    this.setState({
      score: player.score, 
      amount: '0',
      isUpdatingScore: false
    })
    input.clear();
  }
}

PlayerCard.propTypes = {
  store: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  callbackAfterUpdatingScore: PropTypes.func.isRequired
}

const styles = EStyleSheet.create({
  card: {
    backgroundColor: 'white',
    margin: '1.5rem',
    borderRadius: '1rem',
    padding: '1.5rem'
  },
  input: {
    fontSize: '5rem',
    fontWeight: 'bold',
    marginVertical: '3rem'
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '3rem'
  }
})
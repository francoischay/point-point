import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Share,
  View
} from 'react-native';
import PlayerWithScore from '../components/PlayerWithScore';
import PPButton from '../components/PPButton';
import PPHoveringButton from '../components/PPHoveringButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from '../styles/Base';

export default class ScoresModal extends React.Component {

  constructor(props){
    super(props)

    const windowHeight = Dimensions.get('window').height

    this.state = {
      visible: false,
      bgAnim: new Animated.Value(0),
      listAnim: new Animated.Value(windowHeight),
      startGameButtonHeight: 0,
      backToGameButtonHeight: 0
    }
  }

  render() {
    let { bgAnim, listAnim } = this.state;
    const isVisible = this.state.visible ? {top: 0} : {top: Dimensions.get('window').height}  
    const modalHeight = Dimensions.get('window').height - this.state.startGameButtonHeight - this.state.backToGameButtonHeight - EStyleSheet.value('$rem') * 5;

    return (
      <View style = {[styles.modalContainer, isVisible]}>
        <Animated.View style= {[styles.background, {opacity: bgAnim}]} />
        <View style={{marginTop: 24}}>
          <View
            onLayout={(_event) => {
              this.setState({
                startGameButtonHeight: _event.nativeEvent.layout.height
              })
            }}
          >
            <PPButton
              ref="NewPartyButton"
              title="Commencer une nouvelle partie"
              onPress={ this.props.onPress }
            />
          </View>
          <Animated.View
            ref="Modal"
            style= {[styles.modal, {
              marginTop: listAnim,
              height: modalHeight
            }]}
          >
            { this._renderList() }
            <PPButton
              title="Partager"
              onPress={ this._onSharePress }
            />
          </Animated.View>
        </View>
        <View
          onLayout={(_event) => {
            this.setState({
              backToGameButtonHeight: _event.nativeEvent.layout.height
            })
          }}
        >
          <PPHoveringButton
            title="Retour au jeu"
            onPress={()=>{this.hide()}}
            style={{backgroundColor: 'white'}}
            color={Colors.BLUE}
          />
        </View>
      </View>
    );
  }

  _renderList = () => {
    return <FlatList
        contentContainerStyle ={styles.contentContainer}
        data = { this._getRankings() }
        renderItem = {({item}) => this._renderItem(item)}
    />
  }

  _renderItem = (_data) => {
    return <PlayerWithScore 
      data={ _data }
      highlight
    />
  }

  _onSharePress = () => {
    const rankings = this._getRankings();
    const messageElements = rankings.map(_item => _item.icon.item+" "+_item.name+" : "+_item.score)
    const message = messageElements.join('\n');

    Share.share({
      title: "Victoire",
      subject: "Victoire",
      dialogTitle: "Dialog Title",
      message: message
    })
  }

  _getRankings = () => {
    const players = this.props.store.get("players");
    const gamePlayers = []
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if(player.isSelected) gamePlayers.push(player)
    }

    const reverse = this.props.store.get('gameSettings').rankByLessPoints.value ? -1 : 1;
    const rankings = gamePlayers.sort((_player1, _player2) => {
        if (_player2.isEliminated) return -1;
        if (_player1.isEliminated) return 1;
        if (_player1.score > _player2.score) return -1 * reverse;
        if (_player1.score < _player2.score) return 1 * reverse;
    })

    return rankings;
  }

  show = () => {
    this.setState({
      visible: true
    })

    Animated.parallel([
      Animated.timing(
        this.state.bgAnim,
        {
          toValue: 1,
          duration: 500,
        }
      ),
      Animated.timing(
        this.state.listAnim,
        {
          toValue: EStyleSheet.value('$rem'),
          duration: 500,
          easing: Easing.elastic()
        }
      )
    ]).start();
  }

  hide = () => {
    Animated.parallel([
      Animated.timing(
        this.state.bgAnim,
        {
          toValue: 0,
          duration: 500,
          delay: 250
        }
      ),
      Animated.timing(
        this.state.listAnim,
        {
          toValue: Dimensions.get('window').height,
          duration: 500,
          easing: Easing.back()
        }
      )
    ]).start(()=>{
      this.setState({
        visible: false,
      })
    });
  }
}

const styles = EStyleSheet.create({
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    justifyContent: 'space-between',
    zIndex: 10
  },

  background: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },

  modal: {
    backgroundColor: 'white',
    marginHorizontal: '1.5rem',
    borderRadius: '1rem',
    overflow: 'hidden'
  },

  contentContainer: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: '2rem'
  }
});
import React from 'react';
import {
  Animated,
  Button,
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
    }
  }

  render() {
    let { bgAnim, listAnim } = this.state;
    const isVisible = this.state.visible ? {top: 0} : {top: Dimensions.get('window').height}  

    return (
      <View style = {[styles.modalContainer, isVisible]}>
        <Animated.View style= {[styles.background, {opacity: bgAnim}]} />
        <View style={{marginTop: 24}}>
          <PPButton
            title="Commencer une nouvelle partie"
            onPress={ this.props.onPress }
          />
          <Animated.View style= {[styles.modal, {marginTop: listAnim}]}>
            { this._renderList() }
            <PPButton
              title="Partager"
              onPress={ this._onSharePress }
            />
          </Animated.View>
        </View>
        <PPHoveringButton
          title="Retour au jeu"
          onPress={()=>{this.hide()}}
          style={{backgroundColor: 'white'}}
          color={Colors.GREEN}
        />
      </View>
    );
  }

  _renderList = () => {
    const players = this.props.store.get("players");
    const results = players.sort((_player1, _player2) => {
        if (_player1.score > _player2.score) return -1;
        if (_player1.score < _player2.score) return 1;
    })

    results[0].position = 0;
    if(results[1]) results[1].position = 1;
    if(results[2]) results[2].position = 2;

    return <FlatList
        contentContainerStyle ={styles.contentContainer}
        data = { results }
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
    Share.share({
      title: "Title",
      subject: "Subject",
      dialogTitle: "Dialog Title",
      message: "Message",
      url: "http://www.google.com"
    })
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
          toValue: Dimensions.get('window').height * 0.1,
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
    justifyContent: 'space-between'
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
    overflow: 'hidden',
  },

  contentContainer: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: '2rem'
  }
});
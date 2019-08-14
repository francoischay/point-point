import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  PanResponder
} from 'react-native';
import { Colors } from '../styles/Base';
import PlayerCard from '../components/PlayerCard'
import PlayerOptions from '../components/PlayerOptions'
import EStyleSheet from 'react-native-extended-stylesheet';

const defaultBackImage = require('../assets/images/back-icon-white.png');

export default class PlayerScoreScreen extends React.Component {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      playerId: this.props.navigation.state.params.id,
      showOptions: false,
      cardMarginLeft: new Animated.Value(Dimensions.get('window').width),
      optionsOpacity: 1,
      pan: new Animated.ValueXY()
    }

    const players = this.props.screenProps.store.get("players");
    const order = this.props.screenProps.store.get("order");
    const gamePlayers = []
    let previousIndex;
    let nextIndex;

    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < players.length; j++) {
        const player = players[j];
        if(player.id == order[i] && player.isSelected) gamePlayers.push(player)
      }
    }

    for (let i = 0; i < gamePlayers.length; i++) {
      const player = gamePlayers[i];
      if(player.id === this.props.navigation.state.params.id){
        previousIndex = (gamePlayers[i - 1]) ? i-1 : gamePlayers.length-1;
        nextIndex = (gamePlayers[i + 1]) ? i+1 : 0;
      }
    }

    this.nextPlayer = gamePlayers[nextIndex];
    this.previousPlayer = gamePlayers[previousIndex]
    
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        if(gestureState.dx = 0) return false
        else return true
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder:  () => false,
      onMoveShouldSetPanResponderCapture:  () => true,
      onPanResponderMove: Animated.event([
          null, 
          {dx: this.state.pan.x, dy: 0}
        ],
        {listener: () => this._onSwipe()}
      ),
      onResponderTerminationRequest: () => true,
      onPanResponderTerminate: () => {
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          friction: 5
        }).start();
        this.setState({optionsOpacity: 1})
      },
      onPanResponderRelease: (_event, {dx, vx}) => {
        if(dx < -Dimensions.get('window').width / 2 || vx < -0.75){
          this._gotoNextPlayer()
        } 
        else if (dx > Dimensions.get('window').width / 2 || vx > 0.75){
          this._gotoPreviousPlayer()
        }
        else{
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 5
          }).start();
          this.setState({optionsOpacity: 1})
        }
      }
    })
  }

  _onSwipe = () => {
    const threshold = Dimensions.get('window').width / 2;
    let opacityValue = 1 - Math.abs(this.state.pan.x._value)/threshold;
    opacityValue = Math.max(opacityValue, 0.2)
    
    this.setState({
      optionsOpacity: opacityValue
    })
  }

  componentDidMount() {
    if(this.props.navigation.state.params.slideFrom === "left"){
      this.slideFromLeft();
    }
    else{
      this.slideFromRight();
    }
  }
  
  render() {
    const store = this.props.screenProps.store;
    const callback = this.props.screenProps.store.get("gameSettings").goBackToList.value ? this._goBack : this._gotoNextPlayer;

    console.log(callback)
    return (
      <ScrollView 
        style={{
          backgroundColor: Colors.GREEN,
          flex: 1
        }}
        keyboardShouldPersistTaps='never'
      >
        { this._renderHeader() }
        <Animated.View
          style={[{
              marginLeft: this.state.cardMarginLeft,
              width: Dimensions.get('window').width,
              transform: this.state.pan.getTranslateTransform()
            }
          ]}
        >
          <PlayerCard 
            ref='PlayerCard'
            store={ store }
            data={ store.get("players")[this.state.playerId] }
            callbackAfterUpdatingScore={ callback }
          />
        </Animated.View>
        <PlayerOptions 
          store={ store }
          playerId={ this.state.playerId }
          navigation={this.props.navigation}
          style={{
            opacity: this.state.optionsOpacity
          }}
        />
      </ScrollView>
    );
  }
  
  _renderHeader = () => {
    return (<View
      style={{
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      {this._renderLeftHeaderButton()}
      {this._renderRightHeaderButton()}
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
          Scores
        </Text>
      </TouchableOpacity>)
  }

  _renderRightHeaderButton = () => {
    return (
      <TouchableOpacity 
        onPress={ this._gotoNextPlayer } 
        style={styles.headerButtonContainer}
      >
        <Text 
          style={[ 
            styles.headerButtonText, 
            {opacity: this.state.optionsOpacity}
          ]}
        >
          { this.nextPlayer.name }
        </Text>
        <Image
          style={[ 
            styles.iconBack, 
            {opacity: this.state.optionsOpacity}
          ]}
          source={ defaultBackImage }
        />
      </TouchableOpacity>
    )
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _gotoNextPlayer = () => {
    Animated.timing(
      this.state.cardMarginLeft,
      {
        toValue: -Dimensions.get('window').width,
        duration: 250,
        easing: Easing.back()
      }
    ).start(() => {
      this.props.navigation.replace("PlayerScore", this.nextPlayer)
    })
  }

  _gotoPreviousPlayer = () => {
    Animated.timing(
      this.state.cardMarginLeft,
      {
        toValue: Dimensions.get('window').width,
        duration: 250,
        easing: Easing.back()
      }
    ).start(() => {
      const data = Object.assign(this.previousPlayer, {slideFrom: "left"})
      this.props.navigation.replace("PlayerScore", data)
    })
  }

  slideFromRight = () => {
    Animated.timing(
      this.state.cardMarginLeft,
      {
        toValue: 0,
        duration: 500,
        easing: Easing.elastic()
      }
    ).start(() => {
      this.refs.PlayerCard.focusInput();
    });
  }

  slideFromLeft = () => {
    Animated.sequence([
      Animated.timing(
        this.state.cardMarginLeft,
        {
          toValue: -Dimensions.get('window').width,
          duration: 0
        }
      ),
      Animated.timing(
        this.state.cardMarginLeft,
        {
          toValue: 0,
          duration: 500,
          easing: Easing.elastic()
        }
      )
    ])
    .start()
  }
}

const styles = EStyleSheet.create({
  headerContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '1.5rem'
  },
  headerButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerButtonText: {
    color: 'white',
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
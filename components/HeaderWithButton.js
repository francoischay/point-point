import React from 'react';
import {
  Image,
  View, 
  Text,
  TouchableOpacity 
} from 'react-native';
import { Base } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';
import PPHoveringButton from '../components/PPHoveringButton';

const defaultBackImage = require('../assets/images/back-icon.png');

export default class HeaderWithButton extends React.Component {

  render() {
    return (<View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      { this._renderLeftHeaderButton() }
      <PPHoveringButton
        onPress={ this.props.action }
        title={ this.props.actionLabel }
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
            { this.props.goBackLabel }
          </Text>
        </TouchableOpacity>
      )
  }

  _goBack = () => {
      this.props.navigation.goBack()
  }
}

const styles = EStyleSheet.create({
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
  }
})

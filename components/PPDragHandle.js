import React from 'react';
import {
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Colors } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class PPDragHandle extends React.Component {
  render() {
    return <TouchableWithoutFeedback
      onLongPress={ () => { this.props.onHandlePress();  }}
    >
      <View style={ styles.handleContainer }>
        <View style={ styles.dotContainer }>
          <View style={ styles.dot }></View>
          <View style={ styles.dot }></View>
          <View style={ styles.dot }></View>
        </View>
        <View style={ styles.dotContainer }>
          <View style={ styles.dot }></View>
          <View style={ styles.dot }></View>
          <View style={ styles.dot }></View>
        </View>
      </View>
    </TouchableWithoutFeedback>;
  }
}

const styles = EStyleSheet.create({
  handleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: '100%',
    marginHorizontal: '1rem',
    backgroundColor: 'white'
  },
  dotContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    marginHorizontal: '0.25rem' 
  },
  dot : {
    backgroundColor: Colors.GREY,
    borderRadius: '0.25rem',
    height: '0.3rem',
    width: '0.3rem',
    marginBottom: '0.15rem'
  }
})
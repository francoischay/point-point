import React from 'react';
import {
    View
} from 'react-native';
import { Colors } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class PPMore extends React.Component {
  render() {
    return <View style={ styles.dotContainer }>
      <View style={ styles.dot }></View>
      <View style={ styles.dot }></View>
      <View style={ styles.dot }></View>
    </View>;
  }
}

const styles = EStyleSheet.create({
  dotContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    marginHorizontal: '1rem' 
  },
  dot : {
    backgroundColor: Colors.GREY,
    borderRadius: '0.25rem',
    height: '0.4rem',
    width: '0.4rem',
    marginBottom: '0.15rem'
  }
})
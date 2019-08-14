import React from 'react';
import {
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Colors } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class PPCheckbox extends React.Component {
  render() {
    const style = this.props.selected ? styles.selected : styles.normal;
    return <TouchableWithoutFeedback onPress={this.props.onCheckboxPress}>
      <View style={ style }></View>
    </TouchableWithoutFeedback>;
  }
}

const styles = EStyleSheet.create({
  normal : {
    borderColor: Colors.GREEN,
    borderWidth: 1,
    borderRadius: '0.6rem',
    height: '1.2rem',
    width: '1.2rem',
    marginTop: '0.3rem',
    marginRight: '1rem'
  },
  selected : {
    backgroundColor: Colors.GREEN,
    borderColor: Colors.GREEN,
    borderWidth: 1,
    borderRadius: '0.6rem',
    height: '1.2rem',
    width: '1.2rem',
    marginTop: '0.3rem',
    marginRight: '1rem'
  }
})
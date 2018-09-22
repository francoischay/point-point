import React from 'react';
import { TextInput } from 'react-native';

export default class PPTextInput extends React.Component {
  render() {
    return <TextInput
      {...this.props}
      style={[this.props.style]}
      underlineColorAndroid='transparent'
    />;
  }
}

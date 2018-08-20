import React from 'react';
import { TextInput } from 'react-native';

export default class PPTextInput extends React.Component {
  render() {
    return <TextInput
      {...this.props}
      style={[this.props.style, {
        height: 48,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        padding: 12,
        borderRadius: 12
      }]}
    />;
  }
}

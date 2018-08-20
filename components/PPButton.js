import React from 'react';
import { Button } from 'react-native';

export default class PPButton extends React.Component {
  render() {
    return <Button
      {...this.props}
      style={{
        height: 48,
        width: 48,
        backgroundColor: '#000000',
        padding: 12,
        color: 'red'
      }}
    />;
  }
}

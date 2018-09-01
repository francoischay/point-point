import React from 'react';
import { Animated,
  Easing, 
  Dimensions, 
  StyleSheet, 
  Platform, 
  Text} from 'react-native';
import { Base } from '../styles/Base';

const window = Dimensions.get('window');

export default class Row extends React.Component {
  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.easeInElastic,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  render() {
    const {data} = this.props;

    return (
      <Animated.View style={[
        this._style,
        Base.ROW
      ]}>
        <Text style={Base.TEXT}>
          {data.icon} {data.name}
        </Text>
      </Animated.View>
    );
  }
}
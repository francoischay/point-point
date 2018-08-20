import React from 'react';
import { Animated,
  Easing, 
  Dimensions, 
  StyleSheet, 
  Platform, 
  View, 
  Text,
  TouchableHighlight 
} from 'react-native';
import PPTextInput from './PPTextInput';

const window = Dimensions.get('window');

export default class Row extends React.Component {
  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
        styles.row,
        this._style,
      ]}>
        <Text style={{ 
          flex: 1, 
          flexDirection: 'row'
        }}>
          <Text style={{ 
            fontSize: 24, 
            marginLeft: 6, 
            paddingRight: 18
          }}>
            {data.icon}
          </Text>
          <Text style={ styles.text}>
            {data.name}
          </Text>
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    flex: 1,
    marginTop: 1,
    borderRadius: 0,
    borderColor: '#eee',

    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOpacity: 0.2,
        shadowOffset: {height: 3, width: 0},
        shadowRadius: 20,
      },

      android: {
        width: window.width - 30 * 2,
        elevation: 0,
        marginHorizontal: 30,
      },
    })
  },

  text: {
    fontSize: 16,
    color: '#222222'
  },
});

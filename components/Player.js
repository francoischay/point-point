import React from 'react';
import { Animated,
  Easing, 
  Dimensions, 
  StyleSheet, 
  Platform, 
  TouchableWithoutFeedback,
  Text, 
  View} from 'react-native';
import { Base, Colors } from '../styles/Base';
import PPDragHandle from './PPDragHandle';
import PPCheckbox from './PPCheckbox';

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
    const textStyle = data.isSelected ? [Base.TEXT, {color: Colors.GREEN}] : Base.TEXT;

    return (
      <Animated.View style={[
        this._style,
        Base.ROW
      ]}>
        <View style={{ flexDirection: 'row' }}>
          <PPCheckbox 
            selected={data.isSelected}
            onCheckboxPress={() => this.props.onCheckboxPress(data.id)}
          />
          <TouchableWithoutFeedback
            onPress={ () => this.props.onNamePress(data.id) }
          >
            <Text style={textStyle}>
              {data.name} {data.icon.item}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={{
          width: 20,
          flexDirection: 'row'
        }}>
          <PPDragHandle 
            onHandlePress={() => this.props.onHandlePress(data.id)}
          />
        </View>
      </Animated.View>
    );
  }
}
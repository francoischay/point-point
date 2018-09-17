import React from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import Emojis from '../constants/Emojis';

export default class PPAvatarInput extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isActive: false,
      emojiSize: 72,
      currentEmoji: (props.value) ? props.value : {index: 1}
    }
  }

  render() {
    return (
        <FlatList 
          style = {{
            marginTop: 24,
            marginBottom: 24
          }}
          contentContainerStyle = {{
            paddingLeft: Dimensions.get('window').width/2 - this.state.emojiSize / 2
          }}
          data = { Emojis }
          initialScrollIndex={this.state.currentEmoji.index}
          renderItem = {({item}) => this._renderItem(item)}
          getItemLayout={this._getItemLayout}
          onViewableItemsChanged={ this._onViewableItemsChanged }
          snapToInterval={this.state.emojiSize}
          snapToAlignment="center"
          showsHorizontalScrollIndicator = {false}
          pagingEnabled={false}
          horizontal
        />
    )
  }

  _renderItem = (_data) => {
    const _scale = (this.state.currentEmoji.item === _data) ? 1 : 0.4;

    return (
      <View
        style={{
          backgroundColor: 'white',
          width: this.state.emojiSize,
          height: this.state.emojiSize,
          borderRadius: 50,
          borderWidth: 0,
          transform: [{ scale: _scale}]
        }}
        onPress={this._onPress}
      >
        <Text style={{
          fontSize: 48,
          textAlign: 'center',
          paddingLeft: 4,
          paddingTop: 6
        }}>
          {_data}
        </Text>
      </View>
    )
  }

  _getItemLayout = (data, index) => (
    {length: this.state.emojiSize, offset: this.state.emojiSize * index, index}
  );

  _onViewableItemsChanged = ({viewableItems}) => {
    this.setState({
      currentEmoji: viewableItems[0]
    })
    this.props.onChangeAvatar(this.state.currentEmoji)
  }

  _onPress = (_data) => {
    console.log(_data)
  }
}
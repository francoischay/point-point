import React from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import Emojis from '../constants/Emojis';
import { Base } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class PPAvatarInput extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      isActive: false,
      emojiSize: 72,
      currentEmoji: (props.value) ? props.value : {
        index: 0,
        item: Emojis[0]
      }
    }
  }

  render() {
    return (
        <FlatList 
          style = {styles.list}
          contentContainerStyle = {{
            paddingLeft: Dimensions.get('window').width/2 - styles.$emojiSize / 2,
            paddingRight: Dimensions.get('window').width/2 - styles.$emojiSize / 2
          }}
          data = { Emojis }
          initialScrollIndex={this.state.currentEmoji.index}
          renderItem = {({item}) => this._renderItem(item)}
          getItemLayout={this._getItemLayout}
          keyExtractor= {(item, index) => index+""}
          onViewableItemsChanged={ this._onViewableItemsChanged }
          snapToInterval={styles.$emojiSize}
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
        style={[styles.emojiContainer, {
          transform: [{ scale: _scale}]
        }]}
        onPress={this._onPress}
      >
        <Text style={styles.emoji}>
          {_data}
        </Text>
      </View>
    )
  }

  _getItemLayout = (data, index) => (
    {length: styles.$emojiSize, offset: styles.$emojiSize * index, index}
  );

  _onViewableItemsChanged = ({viewableItems}) => {
    if(viewableItems.length === 0) return;

    this.setState({
      viewableItems: viewableItems,
      currentEmoji: viewableItems[0]
    })
  }

  _onPress = (_data) => {
    console.log(_data)
  }
}

const styles = EStyleSheet.create({
  $emojiSize: '6rem',
  list: {
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  emojiContainer: {
    backgroundColor: 'white',
    width: '$emojiSize',
    height: '$emojiSize'
  },
  emoji: {
    fontSize: '4rem',
    textAlign: 'center'
  }
});
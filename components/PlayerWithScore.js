import React from 'react';
import { Dimensions, 
  View, 
  Text,
  TouchableOpacity 
} from 'react-native';
import { Base } from '../styles/Base';
import EStyleSheet from 'react-native-extended-stylesheet';


export default class PlayerWithScore extends React.Component {

  render() {
    const {data} = this.props;
    const medals = ['🥇','🥈','🥉'];
    const medal = medals[data.position]

    return (
        <TouchableOpacity 
            style={Base.ROW}
            onPress={this.props.onPress}
        >
          <View style={{ 
              flex: 1, 
              flexDirection: 'row',
              justifyContent: 'space-between'
          }}>
            { 
              this.props.highlight == true &&
                <Text style={ styles.medal }> { medal }</Text>
            }
            <Text style={Base.TEXT}>
              {data.icon.item} {data.name}
            </Text>
            <Text style={Base.TEXT}>
                {data.score}
            </Text>
          </View>
        </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  medal: {
    position: 'absolute',
    fontSize: '1.5rem',
    top: '1.25rem',
    left: '-0.35rem'
  }
})
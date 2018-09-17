import React from 'react';
import { Dimensions, 
  View, 
  Text,
  TouchableOpacity 
} from 'react-native';
import { Base } from '../styles/Base';


export default class PlayerWithScore extends React.Component {

  render() {
    const {data} = this.props;
    
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
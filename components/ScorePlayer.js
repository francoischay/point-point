import React from 'react';
import { Dimensions, 
  StyleSheet, 
  Platform, 
  View, 
  Text,
  TouchableOpacity 
} from 'react-native';

const window = Dimensions.get('window');

export default class ScorePlayer extends React.Component {

  render() {
    const {data} = this.props;
    
    return (
        <TouchableOpacity 
            style={styles.row}
            onPress={this.props.onPress}
        >
            <View style={{ 
                flex: 1, 
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={{flex: 1}}>
                    <Text style={{ 
                        fontSize: 24, 
                        marginLeft: 6, 
                        paddingRight: 18,
                    }}>
                        {data.icon}
                    </Text>
                    <Text style={ styles.text}>
                        {data.name}
                    </Text>
                </Text>
                <Text style={styles.score}>
                    {data.score}
                </Text>
            </View>
        </TouchableOpacity>
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
    borderColor: '#eee',

    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
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

  image: {
    width: 50,
    height: 50,
    marginRight: 30,
    borderRadius: 25,
  },

  text: {
    fontSize: 16,
    color: '#222222'
  },

  score: {
    fontSize: 16,
    color: '#222222',
    width: 100,
    textAlign: 'right'
  }
});
